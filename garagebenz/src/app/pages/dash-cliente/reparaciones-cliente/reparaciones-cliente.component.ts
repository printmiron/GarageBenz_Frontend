import { Component, inject, signal } from '@angular/core';
import { ReparacionService } from '../../../service/reparacion.service';
import { AuthService } from '../../../service/auth.service';
import { OrdenesReparacionI } from '../../../interface/ordenes-reparacion-i';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reparaciones-cliente',
  imports: [CommonModule],
  templateUrl: './reparaciones-cliente.component.html',
  styleUrl: './reparaciones-cliente.component.css',
})
export class ReparacionesClienteComponent {
  private reparacionService = inject(ReparacionService);
  private authService = inject(AuthService);

  // Signal para guardar las reparaciones
  reparaciones = signal<OrdenesReparacionI[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    const user = this.authService.getUserData(); 
    if (user && user.id) {
      this.cargarHistorial(user.id);
    }
  }

  cargarHistorial(idCliente: string) {
    // En tu componente, dentro de cargarHistorial():
    this.reparacionService.getHistorialCliente(idCliente).subscribe({ 
      next: (data) => {
        this.reparaciones.set(data);
        this.cargando.set(false);
      }
    });
  }
}
