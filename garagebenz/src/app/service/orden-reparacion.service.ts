import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenesReparacionI } from '../interface/ordenes-reparacion-i';
import { environment } from 'src/environment';


@Injectable({ providedIn: 'root' })
export class OrdenReparacionService {
  private apiUrl = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) { }

  
  getOrdenesActivas(): Observable<OrdenesReparacionI[]> {
    return this.http.get<OrdenesReparacionI[]>(`${this.apiUrl}/activas`);
  }

  
  actualizarOrden(orden: OrdenesReparacionI): Observable<OrdenesReparacionI> {
    return this.http.put<OrdenesReparacionI>(`${this.apiUrl}/actualizar/${orden.idOr}`, orden);
  }

  abrirDesdeCita(idCita: string, idTrabajador: string): Observable<OrdenesReparacionI> {
    
    return this.http.post<OrdenesReparacionI>(
      `${this.apiUrl}/abrir/${idCita}/${idTrabajador}`,
      {} 
    );
  }
  
  abrirOrdenDesdeCita(idCita: string, idTrabajador: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ordenes/abrir/${idCita}/${idTrabajador}`, {});
  }
}