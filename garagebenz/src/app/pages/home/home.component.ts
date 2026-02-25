import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  role = signal<string | null>(null);
  userName = signal<string>('');

  userInitials = computed(() => {
    const name = this.userName();
    if (!name || name === 'Usuario') return 'MB';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  ngOnInit() {
    const userData = this.authService.getUserData();
    this.role.set(this.authService.getRole());
    this.userName.set(userData?.nombre || 'Usuario');
  }

  closeSidebar(): void {

    if (window.innerWidth < 992) {
      const el = document.getElementById('sidebarMenu');
      if (el) {
        const bootstrap = (window as any).bootstrap;
        if (bootstrap?.Offcanvas) {
          const instance = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
          instance.hide();
        }
      }
    }
  }

  logout() {
    this.closeSidebar();
    this.authService.logout();
  }
}