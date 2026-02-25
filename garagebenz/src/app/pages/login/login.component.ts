import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    usuario: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
  });

  async onLogin() {
    if (this.loginForm.invalid) return;

    try {
      const res = await this.authService.login(this.loginForm.value);
      
      this.router.navigate([`/dashboard-${res.rol.toLowerCase()}`]);
    } catch (err) {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
