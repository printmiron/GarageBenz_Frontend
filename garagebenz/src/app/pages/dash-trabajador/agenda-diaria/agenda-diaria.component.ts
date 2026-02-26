import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgendaService } from '../../../service/agenda.service';
import { OrdenReparacionService } from '../../../service/orden-reparacion.service';

@Component({
  selector: 'app-agenda-diaria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-diaria.component.html',
  styleUrl: './agenda-diaria.component.css',
})
export class AgendaDiariaComponent implements OnInit {
  private agendaService = inject(AgendaService);
  private ordenService = inject(OrdenReparacionService);
  private router = inject(Router);

  misCitas = this.agendaService.citas;
  estaCargando = this.agendaService.loading;

  ngOnInit() {
    this.agendaService.obtenerCitasHoy();
  }

  iniciarTrabajo(idCita: string) {
    const idTrabajador = localStorage.getItem('userId');

    this.ordenService.abrirDesdeCita(idCita, idTrabajador!).subscribe({
      next: () => {
        
        this.agendaService.citas.update(citas =>
          citas.map(c => c.idCita === idCita ? { ...c, estado: 'En_proceso' } : c)
        );
        
        this.router.navigate(['/dashboard-trabajador/ordenes']);
      }
    });
  }
}