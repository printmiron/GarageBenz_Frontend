import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../../service/cita.service';
import { AuthService } from '../../../service/auth.service';
import { CitaI } from '../../../interface/cita-i';


@Component({
  selector: 'app-citas-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './citas-cliente.component.html',
  styleUrl: './citas-cliente.component.css'
})
export class CitasClienteComponent implements OnInit {
  private citaService = inject(CitaService);
  private authService = inject(AuthService);

  
  citas = signal<CitaI[]>([]);

  ngOnInit() {
    this.cargarCitas();
  }

  async cargarCitas() {
    const clienteId = this.authService.getUserId();
    if (clienteId) {
      try {
        
        const data = await this.citaService.getCitasPorCliente(clienteId);
        this.citas.set(data);
      } catch (error) {
        console.error('Error al traer citas:', error);
      }
    }
  }
}