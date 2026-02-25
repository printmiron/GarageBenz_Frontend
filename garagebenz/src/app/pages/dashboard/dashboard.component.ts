import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FacturaService } from '../../service/factura.service';
import { VehiculoService } from '../../service/vehiculo.service';
import { CitaService } from '../../service/cita.service';
import { ReparacionService } from '../../service/reparacion.service';
import { FacturaStatsI } from 'src/app/interface/factura-stats-i';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private facturaService = inject(FacturaService);
  private vehiculoService = inject(VehiculoService);
  private citaService = inject(CitaService);
  private reparacionService = inject(ReparacionService);

  role = signal<string | null>(null);
  userName = signal<string>('');
  userId = signal<string | null>(null);
  
  
  stats = signal<FacturaStatsI | null>(null);

  
  misVehiculosCount = signal<number>(0);
  proximaCita = signal<any>(null);

  
  tareasPendientes = signal<number>(0);
  ultimaReparacion = signal<any>(null);

  async ngOnInit() {
    const userData = this.authService.getUserData();
    this.role.set(this.authService.getRole());
    this.userName.set(userData?.nombre || 'Usuario');
    this.userId.set(userData?.id || null);

    await this.cargarDatosSegunRol();
  }

  async cargarDatosSegunRol() {
    const r = this.role();
    const id = this.userId();
    const mesActual = new Date().getMonth() + 1;

    
    if (r === 'administrador') {
      this.facturaService.getStatsMensuales(mesActual).subscribe(data => this.stats.set(data));
    }

    
    if (r === 'cliente' && id) {
      try {
        
        const vehiculos = await this.vehiculoService.getVehiculosPorCliente(id);
        this.misVehiculosCount.set(vehiculos.length);

        
        const citas = await this.citaService.getCitasPorCliente(id);
        
        const proxima = citas.find(c => c.estado !== 'Completada' && c.estado !== 'Cancelada');
        this.proximaCita.set(proxima || null);
      } catch (e) {
        console.error("Error cargando datos del cliente:", e);
      }
    }

    
    if (r === 'trabajador' && id) {
      this.reparacionService.getHistorialCliente(id).subscribe(reps => {
        const activas = reps.filter(rep => rep.estadoRep !== 'Completada');
        this.tareasPendientes.set(activas.length);
        this.ultimaReparacion.set(activas[0] || null);
      });
    }
  }
}