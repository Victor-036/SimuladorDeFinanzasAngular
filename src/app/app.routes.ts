import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// Guard para proteger rutas (si no estás logueado, al login)
const authGuard = () => {
  const auth = inject(AuthService);
  return auth.currentUser() ? true : auth.logout(); // Si no hay usuario, logout redirige
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // Protegida
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
