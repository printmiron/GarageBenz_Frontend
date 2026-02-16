import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  role: string | null = '';

  ngOnInit() {

    this.role = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
  }
}
