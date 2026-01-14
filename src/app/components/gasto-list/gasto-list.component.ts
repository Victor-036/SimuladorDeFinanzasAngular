import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngClass
import { GastoService } from '../../services/gasto.service';
import { GastoItemComponent } from '../gasto-item/gasto-item.component';

@Component({
  selector: 'app-gasto-list',
  standalone: true,
  imports: [GastoItemComponent, CommonModule],
  template: `
    <section class="p-6">

      <div class="mb-5 space-y-3">
        <div class="relative">
          <input #search type="text" placeholder="🔍 Buscar gasto..."
            (input)="gs.filtrarPorTexto(search.value)"
            class="w-full bg-slate-100 p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm">
          <span class="absolute left-3 top-3 opacity-50"></span>
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          @for (cat of categorias; track cat) {
            <button
              (click)="gs.filtrarPorCategoria(cat)"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border"
              [ngClass]="{
                'bg-indigo-600 text-white border-indigo-600': gs.categoriaFiltro() === cat,
                'bg-white text-slate-500 border-slate-200 hover:border-indigo-300': gs.categoriaFiltro() !== cat
              }">
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <div class="h-80 overflow-y-auto pr-1">
        <h2 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex justify-between">
          <span>Movimientos</span>
          <span>{{ gs.gastosVisibles().length }} resultados</span>
        </h2>

        @for (g of gs.gastosVisibles(); track g.id) {
          <app-gasto-item
            [item]="g"
            (onRemove)="gs.borrar(g.id)"
            (onEdit)="gs.seleccionarParaEditar($event)" />
        } @empty {
          <div class="text-center py-10 opacity-50">
            <p class="text-4xl mb-2">🕵️‍♂️</p>
            <p class="text-slate-400 text-sm italic">
              {{ gs.busqueda() ? 'No hay coincidencias' : 'Sin movimientos' }}
            </p>
          </div>
        }
      </div>
    </section>
  `
})
export class GastoListComponent {
  public gs = inject(GastoService);
  // Lista estática para generar los botones de filtro
  categorias = ['TODAS', 'Comida', 'Ocio', 'Transporte', 'Otros'];
}
