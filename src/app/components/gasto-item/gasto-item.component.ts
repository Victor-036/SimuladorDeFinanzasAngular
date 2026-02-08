import { Component, input, output } from '@angular/core'; // <--- Importamos output
import { CommonModule } from '@angular/common';
import { Gasto } from '../../interfaces/gasto.interface';

@Component({
  selector: 'app-gasto-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-md dark:shadow-none transition-all mb-2">
 
       <div class="flex flex-col">
         <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
           {{ item().fecha | date:'dd MMM' }} • {{ item().categoria === "Otros" ? item().otrosDescripcion : item().categoria }}
         </span>
         <p class="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{{ item().descripcion }}</p>
         @if(item().detalles) {
             <p class="text-xs text-slate-400 italic mt-0.5">{{ item().detalles }}</p>
         }
       </div>
 
       <div class="flex items-center gap-3">
         <p class="font-black text-slate-900 dark:text-white text-lg">{{ item().monto }}€</p>
 
         <button (click)="onEdit.emit(item())"
           class="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all" title="Editar">
           <i class="bi bi-pencil"></i>
         </button>
 
         <button (click)="onRemove.emit(item().id)"
           class="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all" title="Borrar">
           <i class="bi bi-x-lg"></i>
         </button>
       </div>
     </div>
  `
})
/**
 * Componente que representa un ítem individual de gasto en la lista.
 */
export class GastoItemComponent {
  /** El objeto de gasto a visualizar. Requerido. */
  item = input.required<Gasto>();

  /** Evento emitido al hacer click en el botón de eliminar. Envía el ID. */
  onRemove = output<number>();

  /** Evento emitido al hacer click en editar. Envía el objeto Gasto completo. */
  onEdit = output<Gasto>();
}
