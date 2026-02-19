import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { StockService } from '../../service/stock.service';
import { PiezaService } from '../../service/pieza.service'; // <--- IMPORTADO
import { SotckI } from '../../interface/sotck-i';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);
  private piezaService = inject(PiezaService); // <--- INYECTADO
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

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

  // --- LÓGICA TRABAJADOR ---
  async agregarPieza(item: SotckI, cantidad: number) {
    if (!this.idFinal) return alert('Debes seleccionar una Orden de Trabajo primero.');

    try {
      await this.stockService.asignarPiezaAOrden(this.idFinal, item.pieza.idPieza, cantidad);
      this.piezasAgregadas.update(prev => [...prev, { item, cantidad }]);
      await this.cargarDatos(); // Refrescar stock tras consumir
    } catch (e) {
      alert('Error al asignar pieza');
    }
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

  generarInformePDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('GARAGE BENZ - INFORME TÉCNICO', 14, 22);
    // ... resto de tu lógica de PDF
    doc.save(`Informe_Benz_OT_${this.idFinal}.pdf`);
  }
}