import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../service/stock.service';
import { SotckI } from '../../interface/sotck-i';

@Component({
  selector: 'app-stock',
  imports: [FormsModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);
  idOrdenActual = input.required<string>();

  // Señal para la búsqueda o filtro de texto
  filtroTexto = signal<string>('');

  async ngOnInit() {
    try {
      await this.stockService.cargarStock();
    } catch (e) { console.error(e); }
  }

  // Agrupamos el stock por categoría automáticamente
  stockPorCategoria = computed(() => {
    const stock = this.stockService.stockDisponible();
    const grupos: { [key: string]: SotckI[] } = {};

    stock.forEach(item => {
      const cat = item.pieza.Categoria || 'Sin Categoría';
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(item);
    });

    return grupos;
  });

  // Función para obtener las llaves (nombres de categorías)
  get categorias() {
    return Object.keys(this.stockPorCategoria());
  }

  async agregarPieza(idPieza: string, cantidad: number) {
    if (cantidad <= 0) return;
    try {
      await this.stockService.asignarPiezaAOrden(this.idOrdenActual(), idPieza, cantidad);
      alert('Pieza añadida');
      await this.stockService.cargarStock();
    } catch (e) { alert('Error de stock'); }
  }
}
