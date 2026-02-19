import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/auth';

  // src/app/service/auth.service.ts
async login(credentials: any): Promise<AuthResponse> {
  const response = await firstValueFrom(
    this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
  );

  // LOG DE CONTROL: Mira en la consola cuando des clic al botón de entrar
  console.log('Respuesta completa del servidor:', response);

  localStorage.setItem('token', response.token);
  localStorage.setItem('userRole', response.rol.toLowerCase());
  localStorage.setItem('userId', response.id);

  // FORZAMOS EL GUARDADO: 
  // Si tu Java envía el objeto dentro de "user", lo guardamos así:
  if (response.user) {
    localStorage.setItem('userData', JSON.stringify(response.user));
    console.log('Objeto userData guardado con éxito');
  } else {
    // Si no viene como "user", intentamos guardar la respuesta completa
    localStorage.setItem('userData', JSON.stringify(response));
    console.warn('El servidor no envió la clave "user", guardando respuesta completa');
  }

  return response;
}

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

  // Helpers rápidos para los Guards
  getToken() { return localStorage.getItem('token'); }
  getRole() { return localStorage.getItem('userRole'); }
  getUserId() { return localStorage.getItem('userId'); }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  
}
