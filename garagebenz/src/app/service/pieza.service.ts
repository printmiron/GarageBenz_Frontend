import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class PiezaService {
  private http = inject(HttpClient);
  
  private readonly baseUrl = `${environment.apiUrl}/piezas`;


  async crearPiezaConStock(datos: any): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/crear`, datos)
    );
  }

  
  async listarTodas(): Promise<any[]> {
    return await firstValueFrom(this.http.get<any[]>(this.baseUrl));
  }
}