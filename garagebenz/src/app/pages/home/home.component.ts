import { Component, inject, OnInit, signal } from '@angular/core';
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

  ngOnInit() {
    const userData = this.authService.getUserData();
    this.role.set(this.authService.getRole());
    this.userName.set(userData?.nombre || 'Usuario');
  }

  logout() {
    this.authService.logout();
  }
}