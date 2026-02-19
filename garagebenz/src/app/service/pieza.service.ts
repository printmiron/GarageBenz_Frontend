import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PiezaService {
  private http = inject(HttpClient);
  // Ruta al controlador de Piezas que creamos en Java
  private readonly baseUrl = 'http://localhost:3000/api/piezas';

  /**
   * Envía el DTO con nombre, descripción, precio y cantidadInicial
   * El Backend se encarga de crear la Pieza y el registro en Stock
   */
  async crearPiezaConStock(datos: any): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/crear`, datos)
    );
  }

  // Opcional: Para listar solo piezas sin stock si lo necesitaras
  async listarTodas(): Promise<any[]> {
    return await firstValueFrom(this.http.get<any[]>(this.baseUrl));
  }
}