import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="p-6 text-white transition-colors duration-700 ease-in-out relative overflow-hidden"
      [ngClass]="{
        'bg-indigo-600': gs.estado() === 'OK',
        'bg-orange-500': gs.estado() === 'ALERTA',
        'bg-red-600': gs.estado() === 'CRITICO'
      }">

      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

      <div class="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h1 class="text-2xl font-black italic tracking-tighter">Finance SL</h1>
          <p class="text-[10px] uppercase font-bold opacity-75 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Sistema Activo
          </p>
        </div>

        </div>

      <div class="flex justify-between items-end">
         <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black">{{ gs.total() }}€</span>
            <span class="text-xs opacity-80">/ {{ gs.presupuestoLimite() }}€</span>
         </div>

         <div class="text-right">
             <label class="text-[9px] uppercase opacity-70 block">Meta</label>
             <input type="number" [value]="gs.presupuestoLimite()" (input)="cambiarLimite($event)"
               class="w-16 bg-transparent text-right text-white font-bold border-b border-white/50 focus:border-white outline-none">
         </div>
      </div>

      <div class="mt-4 w-full h-2 bg-black/20 rounded-full overflow-hidden">
        <div class="h-full bg-white transition-all duration-1000" [style.width.%]="anchoBarra()"></div>
      </div>

    </header>
  `
})
export class HeaderComponent {
  public gs = inject(GastoService);

  anchoBarra() { return Math.min(this.gs.porcentaje(), 100); }
  cambiarLimite(e: any) { this.gs.actualizarPresupuesto(Number(e.target.value)); }
}
