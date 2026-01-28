import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { GastoFormComponent } from '../gasto-form/gasto-form.component';
import { GastoListComponent } from '../gasto-list/gasto-list.component';
import { GastoService } from '../../services/gasto.service';
import { AuthService } from '../../services/auth.service'; // <--- Importamos Auth

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, GastoFormComponent, GastoListComponent, CommonModule],
  template: `
    <main class="min-h-screen bg-slate-100 p-4 lg:p-10 font-sans text-slate-900">

      <div class="max-w-7xl mx-auto">

        <div class="flex justify-between items-center mb-6 lg:hidden">
           <span class="font-black italic text-indigo-600 text-xl">DAW Finance</span>
           <button (click)="salir()" class="text-xs font-bold text-red-500 border border-red-200 px-3 py-1 rounded-full">
             Cerrar Sesión
           </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div class="lg:col-span-4 lg:sticky lg:top-10 space-y-6">

            <app-header class="block shadow-xl rounded-3xl overflow-hidden" />

            <button (click)="salir()"
              class="hidden lg:block w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-3xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm flex items-center justify-center gap-2">
              <span>🚪</span> Cerrar Sesión
            </button>

            <div class="hidden lg:block p-6 bg-white rounded-3xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <h3 class="font-bold text-slate-800 mb-2 flex items-center gap-2">
                💡 Consejo del Día
              </h3>
              <p class="text-sm text-slate-500 leading-relaxed italic">
                "{{ consejoActual }}"
              </p>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
              <app-gasto-form />
            </div>

            <div class="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden min-h-[500px]">
              <app-gasto-list />
            </div>
          </div>

        </div>
      </div>
    </main>
  `
})
export class DashboardComponent {
  // Inyectamos los servicios
  public gs = inject(GastoService);
  private auth = inject(AuthService);

  // Lógica de Logout
  salir() {
    this.auth.logout();
  }

  // Lógica de Consejos
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

  consejoActual = this.consejos[Math.floor(Math.random() * this.consejos.length)];
}
