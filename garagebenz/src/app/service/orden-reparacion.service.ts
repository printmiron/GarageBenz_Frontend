import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenesReparacionI } from '../interface/ordenes-reparacion-i';


@Injectable({ providedIn: 'root' })
export class OrdenReparacionService {
  private apiUrl = 'http://localhost:3000/api/ordenes';

  constructor(private http: HttpClient) { }

  // Trae las órdenes que el trabajador tiene abiertas
  getOrdenesActivas(): Observable<OrdenesReparacionI[]> {
    return this.http.get<OrdenesReparacionI[]>(`${this.apiUrl}/activas`);
  }

  // Actualizar diagnóstico, horas y estado
  actualizarOrden(orden: OrdenesReparacionI): Observable<OrdenesReparacionI> {
    return this.http.put<OrdenesReparacionI>(`${this.apiUrl}/actualizar/${orden.idOr}`, orden);
  }

  abrirDesdeCita(idCita: string, idTrabajador: string): Observable<OrdenesReparacionI> {
    // La URL debe coincidir con el @PostMapping de tu Controller de Spring Boot
    return this.http.post<OrdenesReparacionI>(
      `${this.apiUrl}/abrir/${idCita}/${idTrabajador}`,
      {} 
    );
  }
  // En tu service (ej: agenda.service.ts u orden-reparacion.service.ts)
  abrirOrdenDesdeCita(idCita: string, idTrabajador: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ordenes/abrir/${idCita}/${idTrabajador}`, {});
  }
}