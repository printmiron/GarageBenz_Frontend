import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { FacturaStatsI } from '../interface/factura-stats-i';
import { environment } from 'src/environment';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/facturas`;


  
  getStatsMensuales(mes: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/mensual/${mes}`);
  }

  
  async generarFacturaDesdeOrden(idOr: string): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/generar/${idOr}`, {})
    );
  }

  
  getTodasLasFacturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}