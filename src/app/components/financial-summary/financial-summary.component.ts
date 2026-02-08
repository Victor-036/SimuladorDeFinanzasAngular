import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-500 ease-in-out"
      [ngClass]="{
        'bg-indigo-600 dark:bg-indigo-900': gs.estado() === 'OK',
        'bg-amber-500 dark:bg-amber-700': gs.estado() === 'ALERTA',
        'bg-red-600 dark:bg-red-800': gs.estado() === 'CRITICO'
      }">
      
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-2xl font-bold mb-1">Tu Presupuesto</h2>
          <div class="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Actualizado
          </div>
        </div>
      </div>

      <!-- Barra de Progreso Circular o Lineal -->
      <div class="mb-6 relative">
          <div class="flex justify-between items-end mb-2">
             <span class="text-4xl font-black tracking-tight">{{ gs.total() }}€ <span class="text-lg font-medium text-white/70">/ {{ gs.presupuestoLimite() }}€</span></span>
             <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg flex items-center gap-2">
               META 
               <input type="number" [value]="gs.presupuestoLimite()" (input)="cambiarLimite($event)"
               class="w-16 bg-transparent text-right text-white font-bold border-b border-white/50 focus:border-white outline-none">
             </span>
          </div>
          
          <div class="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
             <div class="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  [style.width.%]="anchoBarra()"></div>
          </div>
      </div>

    </div>
  `
})
/**
 * Componente que muestra el resumen financiero (Presupuesto vs Gastos).
 * Incluye una barra de progreso y permite editar el límite del presupuesto.
 */
export class FinancialSummaryComponent {
  public gs = inject(GastoService);

  /** Calcula el ancho de la barra de progreso (máximo 100%). */
  anchoBarra() { return Math.min(this.gs.porcentaje(), 100); }

  /** Actualiza el límite del presupuesto cuando el usuario cambia el input. */
  cambiarLimite(e: any) { this.gs.actualizarPresupuesto(Number(e.target.value)); }
}
