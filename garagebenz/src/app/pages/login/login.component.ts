import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin(datos: any) {
    try {
      const res = await this.authService.login(datos);
      // Redirigimos usando el rol que acabamos de guardar
      this.router.navigate([`/dashboard-${res.rol.toLowerCase()}`]);
    } catch (err) {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
