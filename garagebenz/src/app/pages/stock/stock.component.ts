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


  idRecuperadoDeUrl = signal<string>('');
  piezasAgregadas = signal<{ item: SotckI, cantidad: number }[]>([]);
  esAdmin = signal<boolean>(false);


  nuevaPieza = signal({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'General',
    cantidadInicial: 0
  });

  async ngOnInit() {

    const idUrl = this.route.snapshot.paramMap.get('id');
    if (idUrl) this.idRecuperadoDeUrl.set(idUrl);


    const usuario = this.authService.getUserData();
    const rolLocalStorage = localStorage.getItem('userRole');
    const rolObjeto = usuario?.id_rol || usuario?.rol;

    const rolFinal = (rolObjeto || rolLocalStorage || '').toUpperCase();


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


  async agregarPieza(item: SotckI, cantidad: number) {
    if (!this.idFinal) return alert('No hay una Orden de Trabajo activa.');
    if (cantidad > item.cantidad) return alert('No hay stock suficiente en almacén.');

    try {

      await this.stockService.asignarPiezaAOrden(this.idFinal, item.pieza.idPieza, cantidad);


      this.piezasAgregadas.update(prev => [...prev, { item, cantidad }]);


      item.cantidad -= cantidad;
    } catch (e) {
      alert('Error al asignar pieza a la orden');
    }
  }



  confirmarYVolver() {
    if (this.piezasAgregadas().length === 0) {
      if (!confirm('No has añadido piezas nuevas. ¿Deseas volver a la orden de todos modos?')) return;
    }



    alert('Repuestos asignados correctamente.');
    this.router.navigate(['/dashboard-trabajador/ordenes']);
  }


  async crearNuevaPieza() {
    try {

      await this.piezaService.crearPiezaConStock(this.nuevaPieza());

      alert('Pieza y Stock creados con éxito');


      this.nuevaPieza.set({ nombre: '', descripcion: '', precio: 0, categoria: 'General', cantidadInicial: 0 });


      await this.cargarDatos();
    } catch (e) {
      console.error('Error en crearNuevaPieza:', e);
      alert('Error al conectar con el servidor de piezas');
    }
  }


  async reponerStock(item: SotckI, cantidad: number) {
    try {

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