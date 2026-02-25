import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SotckI } from '../interface/sotck-i';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  
  private readonly baseUrl = 'http://localhost:3000/api/stock';

  
  stockDisponible = signal<SotckI[]>([]);

  /**
   * Carga la lista de Stock (Pieza + Cantidad)
   */
  async cargarStock(): Promise<SotckI[]> {
    const data$ = this.http.get<SotckI[]>(this.baseUrl);
    const res = await firstValueFrom(data$);
    this.stockDisponible.set(res); 
    return res;
  }

  /**
   * Asigna piezas a una Orden de Trabajo (Resta del stock)
   */
  async asignarPiezaAOrden(idOr: string, idPieza: string, cantidad: number) {
    const params = new HttpParams()
      .set('idOr', idOr)
      .set('idPieza', idPieza)
      .set('cantidad', cantidad.toString());

    return await firstValueFrom(
      this.http.post(`${this.baseUrl}/consumir`, null, { params, responseType: 'text' })
    );
  }

  /**
   * Reponer stock de una pieza existente (Para el Admin)
   */
  async reponerStock(idPieza: string, cantidad: number): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${this.baseUrl}/reponer`, { idPieza, cantidad })
    );
  }
}