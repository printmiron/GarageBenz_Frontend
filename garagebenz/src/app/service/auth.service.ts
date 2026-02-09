import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  async login(credentials: any): Promise<AuthResponse> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
    );

    //guardamos el token (vital para el Interceptor)
    localStorage.setItem('accessToken', response.token);

    //guardamos el rol en minúsculas para que coincida con tus rutas
    localStorage.setItem('userRole', response.rol.toLowerCase());

    //guardamos el ID para filtrar datos
    localStorage.setItem('userId', response.id);

    return response;
  }

  // Helpers rápidos para los Guards
  getToken() { return localStorage.getItem('accessToken'); }
  getRole() { return localStorage.getItem('userRole'); }
  getUserId() { return localStorage.getItem('userId'); }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
