import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { FacturaStatsI } from '../interface/factura-stats-i';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/facturas';


  // Espera 1 argumento (el mes)
  getStatsMensuales(mes: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/mensual/${mes}`);
  }

  // Espera 1 argumento (el ID de la orden)
  async generarFacturaDesdeOrden(idOr: string): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/generar/${idOr}`, {})
    );
  }

  // Espera 0 argumentos
  getTodasLasFacturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}