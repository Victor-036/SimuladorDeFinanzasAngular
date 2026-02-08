import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="fixed top-0 left-0 w-full h-[72px] px-6 flex justify-between items-center bg-indigo-900 text-white z-50 shadow-md">

      <!-- Logo / Título -->
      <div class="flex items-center gap-4">
        <div>
          <h1 class="text-xl font-black italic tracking-tighter">Financy</h1>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center gap-4">
        <!-- Selector de tema -->
        <button (click)="toggleTheme()" 
          class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all flex items-center justify-center border border-white/10 w-10 h-10"
          [title]="auth.darkMode() ? 'Modo Claro' : 'Modo Oscuro'">
          <i class="bi" [class]="auth.darkMode() ? 'bi-sun-fill' : 'bi-moon-stars-fill'"></i>
        </button>

        <!-- Cerrar Sesión -->
        <button (click)="salir()" 
          class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 border border-white/10" 
          title="Cerrar Sesión">
          <i class="bi bi-door-open text-lg"></i>
          <span class="hidden sm:inline font-bold text-sm">Cerrar Sesión</span>
        </button>
      </div>

    </header>
  `
})
/**
 * Barra de navegación superior.
 * Contiene el título, el botón de cambio de tema y el botón de cerrar sesión.
 */
export class HeaderComponent {
  public auth = inject(AuthService);

  /** Alterna entre modo claro y oscuro. */
  toggleTheme() { this.auth.toggleDarkMode(); }

  /** Cierra la sesión del usuario. */
  salir() { this.auth.logout(); }
}
