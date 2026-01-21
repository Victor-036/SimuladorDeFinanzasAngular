import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';
import { GastoItemComponent } from '../gasto-item/gasto-item.component';

@Component({
  selector: 'app-gasto-list',
  standalone: true,
  imports: [GastoItemComponent, CommonModule],
  template: `
    <section class="p-6 h-full flex flex-col">

      <div class="flex flex-col gap-4 mb-6 border-b border-slate-100 pb-4">

        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            📊 Historial <span class="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{{ gs.gastosVisibles().length }}</span>
          </h2>
        </div>

        <div class="flex flex-col xl:flex-row gap-4">

          <div class="relative w-full xl:w-64 group">
            <span class="absolute left-3 top-2.5 opacity-40 group-focus-within:opacity-100 group-focus-within:text-indigo-500 transition-all">🔍</span>
            <input #search type="text" placeholder="Buscar concepto..."
              (input)="gs.filtrarPorTexto(search.value)"
              class="w-full bg-slate-50 pl-9 p-2.5 rounded-xl text-sm border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all">
          </div>

          <div class="flex flex-wrap gap-2 items-center">
             <span class="text-[10px] font-bold text-slate-400 uppercase mr-1 hidden md:inline">Filtrar:</span>

             @for (cat of categorias; track cat.id) {
               <button (click)="gs.filtrarPorCategoria(cat.id)"
                 class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm active:scale-95"
                 [ngClass]="{
                   'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200': gs.categoriaFiltro() === cat.id,
                   'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600': gs.categoriaFiltro() !== cat.id
                 }">

                 <span class="text-sm leading-none">{{ cat.icon }}</span>

                 <span class="hidden sm:inline leading-none">{{ cat.label }}</span>
               </button>
             }
          </div>

        </div>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
          @for (g of gs.gastosVisibles(); track g.id) {
            <app-gasto-item class="h-full" [item]="g"
              (onRemove)="gs.borrar(g.id)"
              (onEdit)="gs.seleccionarParaEditar($event)" />
          } @empty {
            <div class="col-span-full py-16 text-center opacity-50 flex flex-col items-center">
              <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-3">
                📭
              </div>
              <p class="text-slate-500 font-medium text-sm">No se encontraron movimientos</p>
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
  `]
})
export class GastoListComponent {
  public gs = inject(GastoService);

  categorias = [
    { id: 'TODAS', label: 'Todo', icon: '📂' },
    { id: 'Comida', label: 'Comida', icon: '🍔' },
    { id: 'Ocio', label: 'Ocio', icon: '🎮' },
    { id: 'Transporte', label: 'Viajes', icon: '🚌' },
    { id: 'Otros', label: 'Otros', icon: '📦' }
  ];

  // Pequeña utilidad para el botón de "Limpiar filtros"
  limpiarFiltros(searchInput: HTMLInputElement) {
    searchInput.value = '';
    this.gs.filtrarPorTexto('');
    this.gs.filtrarPorCategoria('TODAS');
  }
}
