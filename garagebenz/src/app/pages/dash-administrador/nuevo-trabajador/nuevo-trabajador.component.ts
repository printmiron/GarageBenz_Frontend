import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-nuevo-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './nuevo-trabajador.component.html',
  styleUrl: './nuevo-trabajador.component.css',
})
export class NuevoTrabajadorComponent {
  private fb = inject(FormBuilder);
  private userRef = inject(UsuarioService);
  private router = inject(Router);

  // Definimos el formulario con validaciones
  workerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido1: ['', [Validators.required]],
    apellido2: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  async guardar() {
    if (this.workerForm.invalid) {
      this.workerForm.markAllAsTouched();
      return;
    }

    try {
      const nuevoTrabajador = this.workerForm.value;
      await this.userRef.crearTrabajador(nuevoTrabajador);
      alert('¡Trabajador creado con éxito!');
    } catch (error) {
      console.error('Error al crear trabajador:', error);
      alert('Error al guardar el trabajador. Revisa la consola.');
    }
  }
}