import { Component, inject, effect, viewChild, ElementRef } from '@angular/core';
import { GastoService } from '../../services/gasto.service';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  template: `
    <section class="p-5 bg-slate-50 border-b border-slate-200">
      <div class="space-y-3">
        <input #desc type="text" placeholder="Concepto" class="w-full p-3 rounded-xl ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">

        <div class="flex gap-2">
          <input #monto type="number" placeholder="€" class="w-1/3 p-3 rounded-xl ring-1 ring-slate-200 outline-none">
          <input #fecha type="date" class="w-1/3 p-3 rounded-xl ring-1 ring-slate-200 outline-none text-slate-500">

          <select #cat class="w-1/3 p-3 rounded-xl ring-1 ring-slate-200 outline-none bg-white">
            <option value="Comida">🍔 Comida</option>
            <option value="Ocio">🎮 Ocio</option>
            <option value="Transporte">🚌 Viaje</option>
            <option value="Otros">📦 Otros</option>
          </select>
        </div>

        @if (gs.gastoSeleccionado()) {
          <div class="flex gap-2">
            <button (click)="guardar(desc, monto, cat, fecha)" class="w-2/3 bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg">Actualizar</button>
            <button (click)="cancelar(desc, monto, cat, fecha)" class="w-1/3 bg-slate-200 text-slate-600 font-bold py-3 rounded-xl">Cancelar</button>
          </div>
        } @else {
          <button (click)="guardar(desc, monto, cat, fecha)" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
            Añadir Gasto
          </button>
        }
      </div>
    </section>
  `
})
export class GastoFormComponent {
  public gs = inject(GastoService);

  // Referencias a los inputs para poder rellenarlos al editar
  inputDesc = viewChild<ElementRef>('desc');
  inputMonto = viewChild<ElementRef>('monto');
  inputCat = viewChild<ElementRef>('cat');
  inputFecha = viewChild<ElementRef>('fecha');

  constructor() {
    // Efecto para rellenar el formulario al editar
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
    const fecha = f.value || new Date().toISOString().split('T')[0]; // Fecha hoy si está vacía

    if (this.gs.gastoSeleccionado()) {
      // EDITAR
      this.gs.editar(this.gs.gastoSeleccionado()!.id, d.value, Number(m.value), c.value, fecha);
    } else {
      // CREAR (Usamos 'agregar' en vez de 'agregarGasto')
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
