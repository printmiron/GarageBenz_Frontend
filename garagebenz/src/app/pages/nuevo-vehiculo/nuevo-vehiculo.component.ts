import { Component, inject, OnInit } from '@angular/core';
import { VehiculoService } from '../../service/vehiculo.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-vehiculo',
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterLink], 
  templateUrl: './nuevo-vehiculo.component.html',
  styleUrl: './nuevo-vehiculo.component.css',
})
export class NuevoVehiculoComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);

  nuevoVehiculo: any = {
    matricula: '',
    vin: '',
    modelo: '',
    anio: new Date().getFullYear(),
    cliente: {
      idCliente: ''
    }
  };

  ngOnInit() {
    
    const idDesdeStorage = localStorage.getItem('userId');

    
    const usuarioData = localStorage.getItem('usuario');
    const usuarioObj = usuarioData ? JSON.parse(usuarioData) : null;

    if (idDesdeStorage) {
      this.nuevoVehiculo.cliente.idCliente = idDesdeStorage;
    } else if (usuarioObj && usuarioObj.idCliente) {
      this.nuevoVehiculo.cliente.idCliente = usuarioObj.idCliente;
    } else {
      console.error('No se encontró el ID del cliente en localStorage');
      alert('Sesión caducada o usuario no identificado. Por favor, inicia sesión de nuevo.');
      
    }
  }

  async registrar() {
    try {
      
      if (!this.nuevoVehiculo.cliente.idCliente) {
        alert('Error: No se pudo identificar al cliente logueado.');
        return;
      }

      console.log('Enviando a backend:', this.nuevoVehiculo);
      const response = await this.vehiculoService.insertVehiculo(this.nuevoVehiculo);

      alert('¡Vehículo registrado con éxito!');
      this.router.navigate(['/dashboard-cliente/vehiculos']);
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un fallo al registrar. Revisa que la matrícula o VIN no estén duplicados.');
    }
  }
}