import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CitaI } from '../interface/cita-i'; 
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private baseUrl: string = `${environment.apiUrl}/citas`;
  httpClient = inject(HttpClient);

  constructor() { }

  
  getAllCitas(): Promise<CitaI[]> {
    return lastValueFrom(this.httpClient.get<CitaI[]>(this.baseUrl));
  }

  
  getCitasPorCliente(clienteId: string): Promise<CitaI[]> {
    return lastValueFrom(this.httpClient.get<CitaI[]>(`${this.baseUrl}/cliente/${clienteId}`));
  }

  
  getCitaById(id: string): Promise<CitaI> {
    return lastValueFrom(this.httpClient.get<CitaI>(`${this.baseUrl}/${id}`));
  }

  
  
  insertCita(cita: any): Promise<CitaI> {
    return lastValueFrom(this.httpClient.post<CitaI>(this.baseUrl, cita));
  }

  
  updateCita(cita: CitaI): Promise<any> {
    return lastValueFrom(this.httpClient.put<CitaI>(this.baseUrl, cita));
  }

  
  deleteById(id: string): Promise<CitaI> {
    return lastValueFrom(this.httpClient.delete<CitaI>(`${this.baseUrl}/${id}`));
  }
}