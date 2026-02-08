import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoFormComponent } from '../gasto-form/gasto-form.component';
import { GastoListComponent } from '../gasto-list/gasto-list.component';
import { FinancialSummaryComponent } from '../financial-summary/financial-summary.component';
import { GastoService } from '../../services/gasto.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GastoFormComponent, GastoListComponent, FinancialSummaryComponent, CommonModule],
  template: `
    <main class="h-auto lg:h-full flex flex-col font-sans text-slate-900 dark:text-slate-100">
      
      <!-- Encabezado de bienvenida -->
      <header class="mb-4 flex justify-between items-center shrink-0">
        <div>
           <h2 class="text-2xl font-bold flex items-center gap-2">
             <span>Bienvenido, {{ auth.currentUser()?.nombre || 'Usuario' }}</span>
             <span class="text-2xl">👋</span>
           </h2>
           <p class="text-slate-500 dark:text-slate-400 text-sm">Aquí tienes el resumen de tus finanzas hoy.</p>
        </div>
      </header>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-auto lg:h-full lg:overflow-hidden">

        <!-- Barra lateral / Panel izquierdo -->
        <div class="lg:col-span-4 w-full h-auto lg:h-full lg:overflow-y-auto space-y-6 pr-2 lg:pr-0 custom-scrollbar">

          <!-- Resumen Financiero -->
          <app-financial-summary />

          <!-- Tarjeta de consejo -->
          <div class="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <i class="bi bi-lightbulb text-yellow-500"></i> Consejo del Día
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "{{ consejoActual }}"
            </p>
          </div>

        </div>

        <!-- Contenido principal (Formularios y Lista) -->
        <div class="lg:col-span-8 w-full h-auto lg:h-full flex flex-col gap-6 lg:overflow-hidden pb-6">
          
          <!-- Formulario (Fijo arriba del listado en desktop) -->
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 shrink-0">
            <app-gasto-form />
          </div>

          <!-- Listado -->
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 h-auto lg:h-auto lg:flex-1 lg:overflow-hidden min-h-0">
            <app-gasto-list />
          </div>
        </div>

      </div>
    </main>
  `
})
/**
 * Vista principal del usuario logueado.
 * Contiene el resumen financiero, el formulario de gastos y el listado.
 */
export class DashboardComponent {
  // Inyectamos los servicios
  public gs = inject(GastoService);
  public auth = inject(AuthService);

  // Lógica de Consejos
  /** Lista de consejos financieros para mostrar aleatoriamente. */
  consejos: string[] = [
    "La regla 50/30/20 es oro: 50% necesidades, 30% caprichos y 20% ahorro.",
    "Antes de una compra grande (>50€), espera 24 horas.",
    "Revisa tus suscripciones (Netflix, Gym) cada mes.",
    "Cocinar en casa puede ahorrarte más de 150€ al mes.",
    "El ahorro no es lo que te sobra, es lo primero que apartas.",
    "Invierte en experiencias antes que en cosas materiales.",
    "Llevar un registro diario te hace consciente de tu dinero.",
    "Si no puedes comprarlo dos veces, no puedes permitírtelo.",
    "Crea un fondo de emergencia para 3 meses de gastos.",
    "Cuidado con los gastos hormiga: el café diario suma mucho."
  ];

  /** Consejo seleccionado para esta sesión. */
  consejoActual = this.consejos[Math.floor(Math.random() * this.consejos.length)];
}
