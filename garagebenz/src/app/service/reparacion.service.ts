import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenesReparacionI } from '../interface/ordenes-reparacion-i';

@Injectable({
  providedIn: 'root',
})
export class ReparacionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/ordenes'; 

  getHistorialCliente(idCliente: string): Observable<OrdenesReparacionI[]> {
    return this.http.get<OrdenesReparacionI[]>(`${this.baseUrl}/historial/${idCliente}`);
  }
}
