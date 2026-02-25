import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CitaService } from '../../service/cita.service';
import { VehiculoService } from '../../service/vehiculo.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-nuevo-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './nuevo-cita.component.html',
  styleUrl: './nuevo-cita.component.css'
})
export class NuevoCitaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);
  private authService = inject(AuthService);

  
  misVehiculos = signal<any[]>([]);
  isSubmitting = signal(false);

  citaForm: FormGroup = this.fb.group({
    id_vehiculo: ['', Validators.required],
    fecha_cita: ['', Validators.required],
    hora_cita: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10)]]
  });

  async ngOnInit() {
    const clienteId = this.authService.getUserId();

    if (!clienteId) {
      console.error('No se encontró el ID del cliente');
      this.router.navigate(['/login']);
      return;
    }

    try {
      
      const vehiculos = await this.vehiculoService.getVehiculosPorCliente(clienteId);
      this.misVehiculos.set(vehiculos);
    } catch (error) {
      console.error('Error al cargar vehículos', error);
    }
  }

  async onSubmit() {
    if (this.citaForm.invalid) return;
    this.isSubmitting.set(true);

    const dataCita = {
      fechaCita: this.citaForm.value.fecha_cita,
      horaCita: this.citaForm.value.hora_cita,
      descripcion: this.citaForm.value.descripcion,
      estado: 'Pendiente',
      
      cliente: { idCliente: this.authService.getUserId() },
      vehiculo: { idVehiculo: this.citaForm.value.id_vehiculo }
    };

    try {
      await this.citaService.insertCita(dataCita);
      this.router.navigate(['/dashboard-cliente/citas']);
    } catch (error) {
      console.error('Error:', error);
      this.isSubmitting.set(false);
    }
  }
}