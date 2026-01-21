import { Component, inject, effect, viewChild, ElementRef } from '@angular/core';
import { GastoService } from '../../services/gasto.service';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  template: `
    <section class="p-6">
      <h2 class="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span>📝</span> Registrar Movimiento
      </h2>

      <div class="space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
          <input #desc type="text" placeholder="Concepto (ej: Factura Luz)"
            class="flex-[2] p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">

          <select #cat class="flex-1 p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 outline-none cursor-pointer">
            <option value="Comida">🍔 Comida</option>
            <option value="Ocio">🎮 Ocio</option>
            <option value="Transporte">🚌 Viaje</option>
            <option value="Otros">📦 Otros</option>
          </select>
        </div>

        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex gap-2 flex-1">
            <input #monto type="number" placeholder="€ Importe"
              class="w-full p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">

            <input #fecha type="date"
              class="w-full p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200 outline-none text-slate-500 text-sm">
          </div>

          <div class="flex-1 flex gap-2">
            @if (gs.gastoSeleccionado()) {
              <button (click)="guardar(desc, monto, cat, fecha)" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-100">
                Actualizar
              </button>
              <button (click)="cancelar(desc, monto, cat, fecha)" class="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all">
                Cancelar
              </button>
            } @else {
              <button (click)="guardar(desc, monto, cat, fecha)" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-95">
                + Añadir Gasto
              </button>
            }
          </div>
        </div>

      </div>
    </section>
  `
})
export class GastoFormComponent {
  public gs = inject(GastoService);

  inputDesc = viewChild<ElementRef>('desc');
  inputMonto = viewChild<ElementRef>('monto');
  inputCat = viewChild<ElementRef>('cat');
  inputFecha = viewChild<ElementRef>('fecha');

  constructor() {
    effect(() => {
      const g = this.gs.gastoSeleccionado();
      if (g && this.inputDesc()) {
        this.inputDesc()!.nativeElement.value = g.descripcion;
        this.inputMonto()!.nativeElement.value = g.monto;
        this.inputCat()!.nativeElement.value = g.categoria;
        this.inputFecha()!.nativeElement.value = g.fecha;
      }
    });
  }

  guardar(d: HTMLInputElement, m: HTMLInputElement, c: HTMLSelectElement, f: HTMLInputElement) {
    if (!d.value || !m.value) return;
    const fecha = f.value || new Date().toISOString().split('T')[0];

    if (this.gs.gastoSeleccionado()) {
      this.gs.editar(this.gs.gastoSeleccionado()!.id, d.value, Number(m.value), c.value, fecha);
    } else {
      this.gs.agregar(d.value, Number(m.value), c.value, fecha);
    }
    this.limpiar(d, m, f);
  }

  cancelar(d: any, m: any, c: any, f: any) {
    this.gs.cancelarEdicion();
    this.limpiar(d, m, f);
  }

  limpiar(d: any, m: any, f: any) {
    d.value = ''; m.value = ''; f.value = '';
  }
}
