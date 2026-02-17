import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CitaI } from '../interface/cita-i'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private baseUrl: string = "http://localhost:3000/api/citas";
  httpClient = inject(HttpClient);

  constructor() { }

  // Obtener todas las citas (para admin/trabajador)
  getAllCitas(): Promise<CitaI[]> {
    return lastValueFrom(this.httpClient.get<CitaI[]>(this.baseUrl));
  }

  // Obtener las citas de un cliente específico
  getCitasPorCliente(clienteId: string): Promise<CitaI[]> {
    return lastValueFrom(this.httpClient.get<CitaI[]>(`${this.baseUrl}/cliente/${clienteId}`));
  }

  // Obtener una cita por su ID (para la vista de detalles)
  getCitaById(id: string): Promise<CitaI> {
    return lastValueFrom(this.httpClient.get<CitaI>(`${this.baseUrl}/${id}`));
  }

  // Insertar nueva cita
  // Ojo: asegúrate de que el objeto cita que envías cumple con lo que espera el Backend
  insertCita(cita: any): Promise<CitaI> {
    return lastValueFrom(this.httpClient.post<CitaI>(this.baseUrl, cita));
  }

  // Actualizar una cita (cambiar estado, fecha, etc.)
  updateCita(cita: CitaI): Promise<any> {
    return lastValueFrom(this.httpClient.put<CitaI>(this.baseUrl, cita));
  }

  // Cancelar/Eliminar cita
  deleteById(id: string): Promise<CitaI> {
    return lastValueFrom(this.httpClient.delete<CitaI>(`${this.baseUrl}/${id}`));
  }
}