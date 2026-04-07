import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserResponse } from '../acceso-registro/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--background)">
      <div style="background:#fff;border-radius:14px;padding:2.5rem;max-width:420px;width:100%;text-align:center;box-shadow:0 4px 32px rgba(0,0,0,0.08)">
        <div style="font-size:1.75rem;font-weight:800;color:var(--primary);margin-bottom:0.5rem">RutaSegura</div>
        <p style="color:#6B7280;margin-bottom:1.5rem">Bienvenido, <strong>{{ user?.username }}</strong></p>
        <p style="font-size:0.85rem;color:#9CA3AF;margin-bottom:2rem">
          Dashboard en construcción — Ciclo 2
        </p>
        <button (click)="logout()" style="
          padding:0.75rem 2rem;background:var(--danger);color:#fff;
          border:none;border-radius:8px;font-size:0.9rem;font-weight:600;cursor:pointer">
          Cerrar sesión
        </button>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  user: UserResponse | null;

  constructor(private auth: AuthService, private router: Router) {
    if (!this.auth.isLoggedIn()) this.router.navigate(['/login']);
    this.user = this.auth.getUser();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
