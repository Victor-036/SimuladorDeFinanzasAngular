import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/usuarios';

  // Signal que guarda el ID del usuario actual (null = no logueado)
  currentUser = signal<{id: number, nombre: string} | null>(this.recuperarSesion());

  login(email: string, pass: string) {
    // Buscamos en la "BD" si existe alguien con ese email y pass
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&pass=${pass}`).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          const u = usuarios[0];
          const usuarioData = { id: u.id, nombre: u.nombre };

          this.currentUser.set(usuarioData);
          localStorage.setItem('sesion_daw', JSON.stringify(usuarioData));
          this.router.navigate(['/dashboard']); // Redirigir al entrar
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('sesion_daw');
    this.router.navigate(['/login']);
  }

  private recuperarSesion() {
    const s = localStorage.getItem('sesion_daw');
    return s ? JSON.parse(s) : null;
  }
}
