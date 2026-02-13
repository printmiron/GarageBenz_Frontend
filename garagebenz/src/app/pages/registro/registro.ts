import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // ID del rol de cliente (esto debería venir de una constante o del backend)
  // CHAR(36) sugiere un UUID. Usaré un placeholder que el usuario deberá ajustar si es necesario.
  private readonly ID_ROL_CLIENTE = 'CLIENTE-UUID-PLACEHOLDER';

  registroData = {
    nombre: '',
    apellido1: '',
    apellido2: '',
    usuario: '',
    correo: '',
    password: ''
  };

  async onRegister() {
    try {
      const dataToSave = {
        ...this.registroData,
        contraseña: this.registroData.password,
        id_rol: this.ID_ROL_CLIENTE
      };

      await this.authService.register(dataToSave);
      alert('Registro completado con éxito. Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
      alert('Error al realizar el registro. Por favor, revisa los datos.');
    }
  }
}
