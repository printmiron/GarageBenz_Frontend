import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenesReparacionI } from '../../../interface/ordenes-reparacion-i';
import { OrdenReparacionService } from '../../../service/orden-reparacion.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ordenes-de-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Necesarios para Standalone y formularios
  templateUrl: './ordenes-de-trabajo.component.html',
  styleUrl: './ordenes-de-trabajo.component.css',
})
export class OrdenesDeTrabajoComponent implements OnInit {
  // Usamos inject() en lugar de constructor para seguir el estilo moderno
  private ordenService = inject(OrdenReparacionService);

  // Usamos Signals para una detección de cambios más eficiente
  ordenes = signal<OrdenesReparacionI[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarOrdenesActivas();
  }

  cargarOrdenesActivas(): void {
    this.loading.set(true);
    this.ordenService.getOrdenesActivas().subscribe({
      next: (data) => {
        this.ordenes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.loading.set(false);
      }
    });
  }

  finalizarOrden(orden: OrdenesReparacionI): void {
    this.ordenService.actualizarOrden(orden).subscribe({
      next: () => {
        // Quitamos la orden de la lista de "Activas"
        this.ordenes.update(prev => prev.filter(o => o.idOr !== orden.idOr));
        alert('Orden finalizada. El cliente ahora verá su cita como COMPLETADA.');
      }
    });
  }
}