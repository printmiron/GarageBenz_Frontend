import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { ClienteI } from '../interface/cliente-i';
import { TrabajadorI } from '../interface/trabajador-i';
import { ClienteFullI } from '../interface/clientefull-i';
import { UsuarioI } from '../interface/usuario-i';


@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/usuarios';


  clientes = signal<ClienteI[]>([]);
  trabajadores = signal<TrabajadorI[]>([]);


  async cargarClientes() {
    const res = await firstValueFrom(this.http.get<ClienteI[]>(`${this.baseUrl}/clientes`));
    this.clientes.set(res);
  }

  async cargarTrabajadores() {
    const res = await firstValueFrom(this.http.get<TrabajadorI[]>(`${this.baseUrl}/trabajadores`));
    this.trabajadores.set(res);
  }


  async obtenerExpedienteCompleto(id_cliente: string): Promise<ClienteFullI> {
    return await firstValueFrom(this.http.get<ClienteFullI>(`${this.baseUrl}/clientes/${id_cliente}/detalle`));
  }


  async crearTrabajador(nuevo: UsuarioI) {

    return await firstValueFrom(this.http.post<TrabajadorI>(`${this.baseUrl}/trabajadores`, nuevo));
  }


  async eliminarUsuario(id: string, tipo: 'clientes' | 'trabajadores') {
    if (!id) {
      console.error("No se puede eliminar: ID no proporcionado");
      return;
    }

    try {

      await firstValueFrom(this.http.delete(`${this.baseUrl}/${tipo}/${id}`));


      if (tipo === 'clientes') {
        await this.cargarClientes();
      } else {
        await this.cargarTrabajadores();
      }
    } catch (error) {
      console.error(`Error al eliminar ${tipo}:`, error);
      alert('No se pudo eliminar. Verifica si el usuario tiene datos asociados (vehículos/OTs).');
    }
  }

  async actualizarUsuario(id: string, datos: Partial<UsuarioI>) {
    return await firstValueFrom(this.http.put(`${this.baseUrl}/${id}`, datos));
  }

  // En tu service .ts
  deleteTrabajador(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/trabajador/${id}`);
  }
}