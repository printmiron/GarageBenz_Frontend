import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { VehicloI } from '../interface/vehiclo-i';


@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private baseUrl: string = "http://localhost:3000/api/vehiculos";
  httpClient = inject(HttpClient);

  constructor() { }

  getAllVehiculos(): Promise<VehicloI[]> {
    return lastValueFrom(this.httpClient.get<VehicloI[]>(this.baseUrl));
  }

  getVehiculosPorCliente(clienteId: string): Promise<VehicloI[]> {
    return lastValueFrom(this.httpClient.get<VehicloI[]>(`${this.baseUrl}/cliente/${clienteId}`));
  }

  getVehiculoById(id: string): Promise<VehicloI> {
    return lastValueFrom(this.httpClient.get<VehicloI>(this.baseUrl + "/" + id));
  }

  insertVehiculo(vehiculo: VehicloI): Promise<VehicloI> {
    return lastValueFrom(this.httpClient.post<VehicloI>(this.baseUrl, vehiculo));
  }

  updateVehiculo(vehiculo: VehicloI): Promise<any> {
    return lastValueFrom(this.httpClient.put<VehicloI>(this.baseUrl, vehiculo));
  }

  deleteById(id: string): Promise<VehicloI> {
    return lastValueFrom(this.httpClient.delete<VehicloI>(this.baseUrl + "/" + id));
  }
}