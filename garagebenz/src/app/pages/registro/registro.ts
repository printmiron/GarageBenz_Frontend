import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  registerForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);

  statusMessage: { text: string, type: 'success' | 'error' } | null = null;

  // ESTE ES EL UUID QUE TU BASE DE DATOS RECONOCE
  private readonly ROLE_CLIENTE_UUID = 'e3b0c442-98fc-11ee-b9d1-0242ac120002';

  constructor() {
    this.registerForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido1: new FormControl(null, [Validators.required]),
      apellido2: new FormControl(null, [Validators.required]),
      usuario: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      contrasena: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      id_rol: new FormControl(this.ROLE_CLIENTE_UUID)
    });
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      const response = await this.authService.register(this.registerForm.value);
      console.log('Respuesta del servidor:', response);

      this.showMessage('REGISTRO COMPLETADO. BIENVENIDO.', 'success');

      // Redirigimos al login tras el éxito
      setTimeout(() => this.router.navigate(['/login']), 2500);

    } catch (err) {
      console.error('Error real:', err);
      this.showMessage('ERROR EN EL REGISTRO. INTÉNTELO DE NUEVO.', 'error');
    }
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.statusMessage = { text, type };
    setTimeout(() => this.statusMessage = null, 3500);
  }

  Control(name: string, validator: string) {
    const ctrl = this.registerForm.get(name);
    return ctrl?.hasError(validator) && ctrl?.touched;
  }
}