import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { StockService } from '../../service/stock.service';
import { PiezaService } from '../../service/pieza.service'; 
import { SotckI } from '../../interface/sotck-i';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { FacturaService } from 'src/app/service/factura.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);
  private piezaService = inject(PiezaService);
  private facturaService = inject(FacturaService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estados
  idRecuperadoDeUrl = signal<string>('');
  piezasAgregadas = signal<{ item: SotckI, cantidad: number }[]>([]);
  esAdmin = signal<boolean>(false);

  // Formulario para Admin (Asegúrate de que los nombres coincidan con el DTO de Java)
  nuevaPieza = signal({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'General',
    cantidadInicial: 0
  });

  async ngOnInit() {
    // 1. Recuperar ID de la URL
    const idUrl = this.route.snapshot.paramMap.get('id');
    if (idUrl) this.idRecuperadoDeUrl.set(idUrl);

    // 2. Detectar rol
    const usuario = this.authService.getUserData();
    const rolLocalStorage = localStorage.getItem('userRole');
    const rolObjeto = usuario?.id_rol || usuario?.rol;

    const rolFinal = (rolObjeto || rolLocalStorage || '').toUpperCase();

    // Cambiado a ADMINISTRADOR para que coincida con tu SQL
    this.esAdmin.set(rolFinal === 'ADMINISTRADOR');

    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      await this.stockService.cargarStock();
    } catch (e) {
      console.error('Error al cargar stock:', e);
    }
  }

  get idFinal() { return this.idRecuperadoDeUrl(); }

  // Agrupación por categoría para la UI
  stockPorCategoria = computed(() => {
    const stock = this.stockService.stockDisponible();
    const grupos: { [key: string]: SotckI[] } = {};
    stock.forEach(item => {
      const cat = item.pieza.categoria || 'Sin Categoría';
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(item);
    });
    return grupos;
  });

  get categorias() { return Object.keys(this.stockPorCategoria()); }

  totalPresupuesto = computed(() => {
    return this.piezasAgregadas().reduce((acc, p) => acc + ((p.item.pieza.precio || 0) * p.cantidad), 0);
  });

  // BOTÓN "UTILIZAR / AÑADIR"
  async agregarPieza(item: SotckI, cantidad: number) {
    if (!this.idFinal) return alert('No hay una Orden de Trabajo activa.');
    if (cantidad > item.cantidad) return alert('No hay stock suficiente en almacén.');

    try {
      // 1. Registramos el uso en la tabla intermedia del Back
      await this.stockService.asignarPiezaAOrden(this.idFinal, item.pieza.idPieza, cantidad);

      // 2. Añadimos a la lista visual de la derecha
      this.piezasAgregadas.update(prev => [...prev, { item, cantidad }]);

      // 3. Opcional: bajar el stock visualmente (el descuento real se hará al facturar)
      item.cantidad -= cantidad;
    } catch (e) {
      alert('Error al asignar pieza a la orden');
    }
  }

  // BOTÓN "FINALIZAR Y FACTURAR"
  // Cambia el método finalizarYFacturar por este:
  confirmarYVolver() {
    if (this.piezasAgregadas().length === 0) {
      if (!confirm('No has añadido piezas nuevas. ¿Deseas volver a la orden de todos modos?')) return;
    }

    // Como el método agregarPieza() ya llama a asignarPiezaAOrden (el backend ya tiene los datos)
    // solo necesitamos volver.
    alert('Repuestos asignados correctamente.');
    this.router.navigate(['/dashboard-trabajador/ordenes']);
  }

  // --- LÓGICA ADMINISTRADOR (PIEZA SERVICE) ---
  async crearNuevaPieza() {
    try {
      // USAMOS EL NUEVO SERVICIO DE PIEZA
      await this.piezaService.crearPiezaConStock(this.nuevaPieza());

      alert('Pieza y Stock creados con éxito');

      // Limpiamos el formulario
      this.nuevaPieza.set({ nombre: '', descripcion: '', precio: 0, categoria: 'General', cantidadInicial: 0 });

      // Refrescamos el stock general para ver la nueva pieza
      await this.cargarDatos();
    } catch (e) {
      console.error('Error en crearNuevaPieza:', e);
      alert('Error al conectar con el servidor de piezas');
    }
  }

  // --- LÓGICA ADMINISTRADOR (STOCK SERVICE) ---
  async reponerStock(item: SotckI, cantidad: number) {
    try {
      // Usamos el StockService porque estamos alterando unidades de algo que ya existe
      await this.stockService.reponerStock(item.pieza.idPieza, cantidad);
      alert(`Stock actualizado: +${cantidad} unidades para ${item.pieza.nombre}`);
      await this.cargarDatos();
    } catch (e) {
      console.error('Error en reponerStock:', e);
      alert('Error al actualizar stock');
    }
  }



  generarInformePDF(facturaData?: any) {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('GARAGE BENZ - INFORME TÉCNICO', 14, 22);

    if (facturaData) {
      doc.setFontSize(12);
      doc.text(`Factura Nº: ${facturaData.numeroFactura}`, 14, 32);
      doc.text(`Total: ${facturaData.importeTotal} EUR`, 14, 40);
    }

    doc.save(`Informe_Benz_OT_${this.idFinal}.pdf`);
  }
}