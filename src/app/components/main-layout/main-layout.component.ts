import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="pt-[80px] h-auto min-h-screen lg:h-screen w-full bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col lg:overflow-hidden transition-colors duration-300">
      <div class="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 lg:overflow-hidden flex flex-col">
        <router-outlet/>
      </div>
    </main>
  `
})
/**
 * Layout principal para usuarios autenticados.
 * Incluye el Header fijo y el contenedor para las rutas hijas (Dashboard, etc.).
 */
export class MainLayoutComponent { }
