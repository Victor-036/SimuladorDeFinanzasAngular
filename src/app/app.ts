import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { GastoFormComponent } from './components/gasto-form/gasto-form.component';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { GastoService } from './services/gasto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, GastoFormComponent, GastoListComponent],
  template: `
    <main class="min-h-screen bg-slate-100 p-4 lg:p-10 font-sans text-slate-900">

      <div class="max-w-7xl mx-auto">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div class="lg:col-span-4 lg:sticky lg:top-10 space-y-6">
            <app-header class="block shadow-xl rounded-3xl overflow-hidden" />

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
export class AppComponent {
  public gs = inject(GastoService);

  // LISTA DE CONSEJOS
  consejos: string[] = [
    "La regla 50/30/20 es oro: 50% necesidades, 30% caprichos y 20% ahorro.",
    "Antes de una compra grande (>50€), espera 24 horas. El impulso suele desaparecer.",
    "Revisa tus suscripciones (Netflix, Gym, Apps) cada mes. ¿Realmente usas todas?",
    "Cocinar en casa puede ahorrarte más de 150€ al mes comparado con pedir a domicilio.",
    "El ahorro no es lo que te sobra al final del mes, es lo primero que debes apartar.",
    "Invierte en experiencias (viajes, cursos) antes que en cosas materiales. Dan más felicidad.",
    "Llevar un registro diario de gastos te hace un 30% más consciente de tu dinero.",
    "Si no puedes comprarlo dos veces al contado, en realidad no puedes permitírtelo.",
    "Un fondo de emergencia debería cubrir al menos 3 meses de tus gastos básicos.",
    "Cuidado con los 'gastos hormiga': el café diario de 2€ son 730€ al año."
  ];

  // ELEGIR UNO AL AZAR
  // Math.floor redondea hacia abajo, Math.random da un número entre 0 y 1
  consejoActual = this.consejos[Math.floor(Math.random() * this.consejos.length)];
}
