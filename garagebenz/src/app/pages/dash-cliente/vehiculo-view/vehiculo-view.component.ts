import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { VehiculoService } from '../../../service/vehiculo.service';

@Component({
  selector: 'app-vehiculo-view',
  standalone: true, // Siempre standalone en versiones modernas
  imports: [CommonModule, RouterLink],
  templateUrl: './vehiculo-view.component.html'
})
export class VehiculoViewComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);

  // Usamos un Signal para los datos
  vehiculos = signal<any[]>([]);

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      const data = await this.vehiculoService.getAllVehiculos();
      this.vehiculos.set(data);
    } catch (err) {
      console.error('Error al cargar la flota:', err);
    }
  }


  async eliminar(id: string) {
    if(confirm('¿Retirar este vehículo del sistema?')) {
       await this.vehiculoService.deleteById(id);
       this.cargarDatos(); // Refrescar
    }
  }
}