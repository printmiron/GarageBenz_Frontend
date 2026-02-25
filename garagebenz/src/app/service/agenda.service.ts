import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaI } from '../interface/cita-i';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/citas/hoy';


  citas = signal<CitaI[]>([]);
  loading = signal<boolean>(false);

  obtenerCitasHoy() {
    this.loading.set(true);
    this.http.get<CitaI[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.citas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando agenda', err);
        this.loading.set(false);
      }
    });
  }

 
}