import { Component, input, output } from '@angular/core'; // <--- Importamos output
import { CommonModule } from '@angular/common';
import { Gasto } from '../../interfaces/gasto.interface';

@Component({
  selector: 'app-gasto-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all mb-2">

      <div class="flex flex-col">
        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
          {{ item().fecha | date:'dd MMM' }} • {{ item().categoria }}
        </span>
        <p class="font-bold text-slate-800 text-sm leading-tight">{{ item().descripcion }}</p>
      </div>

      <div class="flex items-center gap-3">
        <p class="font-black text-slate-900 text-lg">{{ item().monto }}€</p>

        <button (click)="onEdit.emit(item())"
          class="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Editar">
          ✎
        </button>

        <button (click)="onRemove.emit(item().id)"
          class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Borrar">
          ×
        </button>
      </div>
    </div>
  `
})
export class GastoItemComponent {
  item = input.required<Gasto>();

  // Outputs: Eventos hacia el padre
  onRemove = output<number>();

  // --- ESTO ES LO QUE TE FALTA ---
  onEdit = output<Gasto>(); // Definimos que este evento envía un objeto Gasto completo
}
