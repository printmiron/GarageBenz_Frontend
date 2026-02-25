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

  
  user = signal<any>(null);

  
  initials = computed(() => {
    const u = this.user();
    if (!u?.nombre || !u?.apellido1) return '??';
    return `${u.nombre.charAt(0)}${u.apellido1.charAt(0)}`.toUpperCase();
  });

  
  roleBadgeClass = computed(() => {
    const rol = this.user()?.rol?.toLowerCase();
    if (rol === 'administrador') return 'bg-danger';
    if (rol === 'trabajador') return 'bg-info text-dark';
    return 'bg-primary';
  });

  ngOnInit(): void {
    const data = this.authService.getUserData();
    if (data) {
      
      
      this.user.set(data.user || data); 
    }
  }
}