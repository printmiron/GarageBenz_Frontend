import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  async login(credentials: any): Promise<AuthResponse> {
    // 1. Realizamos la petición y esperamos la respuesta
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
    );

    // 2. TODO este código debe estar DENTRO de la función login
    console.log('Respuesta completa del servidor:', response);

    if (response) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.rol.toLowerCase());
      localStorage.setItem('userId', response.id.toString());

      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
        console.log('Objeto userData guardado con éxito');
      } else {
        localStorage.setItem('userData', JSON.stringify(response));
        console.warn('El servidor no envió la clave "user", guardando respuesta completa');
      }
    }

    return response; 
  } // <-- Aquí se cierra la función login correctamente

  getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  async register(userData: any): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/register`, userData, {
        responseType: 'text' as 'json'
      })
    );
  }

  getToken() { return localStorage.getItem('token'); }
  getRole() { return localStorage.getItem('userRole'); }
  getUserId() { return localStorage.getItem('userId'); }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    // En Angular es mejor usar el Router, pero esto funciona:
    window.location.href = '/login';
  }
}