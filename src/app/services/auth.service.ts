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
  currentUser = signal<{ id: number, nombre: string } | null>(this.recuperarSesion());

  // Signal para el tema (oscuro/claro)
  darkMode = signal<boolean>(this.recuperarTema());

  constructor() {
    // Aplicar tema al inicio
    this.aplicarTema(this.darkMode());
  }

  // --- TEMA ---
  toggleDarkMode() {
    this.darkMode.update(v => !v);
    this.aplicarTema(this.darkMode());
    localStorage.setItem('tema_oscuro', JSON.stringify(this.darkMode()));
  }

  private recuperarTema(): boolean {
    const t = localStorage.getItem('tema_oscuro');
    return t ? JSON.parse(t) : false; // Por defecto claro
  }

  private aplicarTema(esOscuro: boolean) {
    if (esOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // --- AUTENTICACIÓN ---

  /**
   * Intenta iniciar sesión con email y contraseña.
   * @returns Observable con true si el login es correcto, false si falla.
   */
  login(email: string, pass: string) {
    // Buscamos en la "BD" si existe alguien con ese email y pass
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&pass=${pass}`).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          const u = usuarios[0];
          this.guardarSesion({ id: u.id, nombre: u.nombre });
          return true;
        } else {
          return false;
        }
      })
    );
  }

  /**
   * Registra un nuevo usuario si el email no existe.
   */
  register(nombre: string, email: string, pass: string) {
    // Primero verificamos si el email ya existe
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          throw new Error('El email ya está registrado');
        }
        return true;
      }),
      // Si no existe, procedemos a crear
      map(() => {
        const nuevoUsuario = { nombre, email, pass };
        // Nota: En un entorno real, esto debería encadenarse con switchMap, 
        // pero para json-server simple, hacemos la llamada POST aquí.
        this.http.post<any>(this.apiUrl, nuevoUsuario).subscribe(u => {
          this.guardarSesion({ id: u.id, nombre: u.nombre });
        });
        return true;
      })
    );
  }

  /** Cierra la sesión del usuario actual y redirige al login. */
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('sesion_daw');
    this.router.navigate(['/login']);
  }

  private guardarSesion(usuario: { id: number, nombre: string }) {
    this.currentUser.set(usuario);
    localStorage.setItem('sesion_daw', JSON.stringify(usuario));
    this.router.navigate(['/dashboard']);
  }

  private recuperarSesion() {
    const s = localStorage.getItem('sesion_daw');
    return s ? JSON.parse(s) : null;
  }
}
