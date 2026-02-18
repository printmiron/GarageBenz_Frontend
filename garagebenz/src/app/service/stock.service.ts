import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SotckI } from '../interface/sotck-i';


@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/stock';

  // Usamos un Signal para mantener el estado reactivo
  stockDisponible = signal<SotckI[]>([]);

  // Obtener stock convertido a Promesa
  async cargarStock(): Promise<SotckI[]> {
    const data$ = this.http.get<SotckI[]>(this.apiUrl);
    const res = await firstValueFrom(data$);
    this.stockDisponible.set(res); // Actualizamos el signal para la UI
    return res;
  }

  // Consumir pieza convertido a Promesa
  async asignarPiezaAOrden(idOr: string, idPieza: string, cantidad: number): Promise<string> {
    const params = new HttpParams()
      .set('idOr', idOr)
      .set('idPieza', idPieza)
      .set('cantidad', cantidad.toString());

    const call$ = this.http.post(`${this.apiUrl}/consumir`, null, { 
      params, 
      responseType: 'text' 
    });

    return await firstValueFrom(call$);
  }
}