import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';
import { GastoItemComponent } from '../gasto-item/gasto-item.component';

@Component({
  selector: 'app-gasto-list',
  standalone: true,
  imports: [GastoItemComponent, CommonModule],
  template: `
    <section class="p-6 h-auto lg:h-full flex flex-col">

      <div class="flex flex-col gap-4 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">

        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i class="bi bi-bar-chart-fill"></i> Historial <span class="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{{ gs.gastosVisibles().length }}</span>
          </h2>
        </div>

        <div class="flex flex-col xl:flex-row gap-4">

          <div class="relative w-full xl:w-64 group">
            <span class="absolute left-3 top-3 opacity-40 group-focus-within:opacity-100 group-focus-within:text-indigo-500 transition-all dark:text-slate-400"><i class="bi bi-search"></i></span>
            <input #search type="text" placeholder="Buscar concepto..."
              (input)="gs.filtrarPorTexto(search.value)"
              class="w-full bg-slate-50 dark:bg-slate-700 pl-9 p-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all">
          </div>

          <div class="flex flex-wrap gap-2 items-center">
             <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mr-1 hidden md:inline">Filtrar:</span>

             @for (cat of categorias; track cat.id) {
               <button (click)="gs.filtrarPorCategoria(cat.id)"
                 class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm active:scale-95"
                 [ngClass]="{
                   'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200': gs.categoriaFiltro() === cat.id,
                   'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400': gs.categoriaFiltro() !== cat.id
                 }">

                 <span class="text-sm leading-none"><i [class]="cat.icon"></i></span>

                 <span class="hidden sm:inline leading-none">{{ cat.label }}</span>
               </button>
             }
          </div>

        </div>
      </div>

      <div class="flex-1 lg:overflow-y-auto pr-2 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
          @for (g of gs.gastosVisibles(); track g.id) {
            <app-gasto-item class="h-full" [item]="g"
              (onRemove)="gs.borrar(g.id)"
              (onEdit)="gs.seleccionarParaEditar($event)" />
          } @empty {
            <div class="col-span-full py-16 text-center opacity-50 flex flex-col items-center">
              <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl mb-3">
                <i class="bi bi-inbox text-slate-400 dark:text-slate-500"></i>
              </div>
              <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">No se encontraron movimientos</p>
              @if(gs.busqueda() || gs.categoriaFiltro() !== 'TODAS') {
                <button (click)="limpiarFiltros(search)" class="mt-2 text-indigo-500 text-xs font-bold hover:underline">
                  Limpiar filtros
                </button>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #64748b; }
  `]
})
/**
 * Componente que muestra el listado de gastos con opciones de filtrado.
 */
export class GastoListComponent {
  public gs = inject(GastoService);

  /** Categorías disponibles para el filtro. */
  categorias = [
    { id: 'TODAS', label: 'Todo', icon: 'bi bi-folder' },
    { id: 'Comida', label: 'Comida', icon: 'bi bi-egg-fried' },
    { id: 'Ocio', label: 'Ocio', icon: 'bi bi-controller' },
    { id: 'Transporte', label: 'Viajes', icon: 'bi bi-bus-front' },
    { id: 'Otros', label: 'Otros', icon: 'bi bi-box-seam' }
  ];

  /** 
   * Limpia los filtros de búsqueda y categoría.
   * @param searchInput Referencia al input de búsqueda para limpiarlo visualmente.
   */
  limpiarFiltros(searchInput: HTMLInputElement) {
    searchInput.value = '';
    this.gs.filtrarPorTexto('');
    this.gs.filtrarPorCategoria('TODAS');
  }
}
