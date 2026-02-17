import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);

  // Signal para el usuario
  user = signal<any>(null);

  // Computed para las iniciales (se actualiza solo si el usuario cambia)
  initials = computed(() => {
    const u = this.user();
    if (!u?.nombre || !u?.apellido1) return '??';
    return `${u.nombre.charAt(0)}${u.apellido1.charAt(0)}`.toUpperCase();
  });

  // Computed para la clase del badge
  roleBadgeClass = computed(() => {
    const rol = this.user()?.rol?.toLowerCase();
    if (rol === 'administrador') return 'bg-danger';
    if (rol === 'trabajador') return 'bg-info text-dark';
    return 'bg-primary';
  });

  ngOnInit(): void {
    const data = this.authService.getUserData();
    if (data) {
      // Si tu backend ahora envía el objeto 'user' dentro de la respuesta, 
      // asegúrate de acceder a la propiedad correcta:
      this.user.set(data.user || data); 
    }
  }
}