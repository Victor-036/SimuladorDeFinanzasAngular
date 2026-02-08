import { Component, inject, effect, signal } from '@angular/core';
import { GastoService } from '../../services/gasto.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <section class="p-6">
      <h2 class="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
        <span><i class="bi bi-pencil-square"></i></span> Registrar Movimiento
      </h2>

      <form [formGroup]="gastoForm" (ngSubmit)="guardar()" class="space-y-4">
        <!-- Fila 1: Concepto y Categoría -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-[2]">
            <input formControlName="descripcion" type="text" placeholder="Concepto (ej: Factura Luz)"
              class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              [class.ring-red-500]="esInvalido('descripcion')">
            @if (esInvalido('descripcion')) {
              <p class="text-red-500 text-xs mt-1 font-bold ml-1">El concepto es obligatorio</p>
            }
          </div>

          <div class="flex-1">
            <select formControlName="categoria" (change)="verificarCategoria()" 
              class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 outline-none cursor-pointer dark:text-white">
              <option value="Comida">Comida</option>
              <option value="Ocio">Ocio</option>
              <option value="Transporte">Viaje</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <!-- Fila 2: Descripción opcional y campo específico "Otros" -->
        <div class="flex flex-col md:flex-row gap-4">
           <div class="flex-1">
             <input formControlName="detalles" type="text" placeholder="Descripción opcional..."
               class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500">
           </div>
           
           @if (mostrarOtroInput()) {
             <div class="flex-1">
               <input formControlName="otrosDescripcion" type="text" placeholder="Especificar otro..."
                 class="w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-200 dark:ring-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-indigo-700 dark:text-indigo-300 placeholder-indigo-300"
                 [class.ring-red-500]="esInvalido('otrosDescripcion')">
                 @if (esInvalido('otrosDescripcion')) {
                   <p class="text-red-500 text-xs mt-1 font-bold ml-1">Especifica la categoría</p>
                 }
             </div>
           }
        </div>

        <!-- Fila 3: Importe, Fecha y Botones -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex gap-2 flex-1 items-start">
            <div class="w-full">
              <input formControlName="monto" type="number" placeholder="€ Importe" step="0.01"
                class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                [class.ring-red-500]="esInvalido('monto')">
              @if (gastoForm.get('monto')?.hasError('required') && gastoForm.get('monto')?.touched) {
                <p class="text-red-500 text-xs mt-1 font-bold ml-1">Importe requerido</p>
              }
              @if (gastoForm.get('monto')?.hasError('min') && gastoForm.get('monto')?.touched) {
                <p class="text-red-500 text-xs mt-1 font-bold ml-1">Mínimo 0.01€</p>
              }
            </div>

            <div class="w-full">
              <input formControlName="fecha" type="date"
                class="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 outline-none text-slate-500 dark:text-slate-300 text-sm"
                [class.ring-red-500]="esInvalido('fecha')">
              @if (esInvalido('fecha')) {
                <p class="text-red-500 text-xs mt-1 font-bold ml-1">Fecha requerida</p>
              }
            </div>
          </div>

          <div class="flex-1 flex gap-2">
            @if (gs.gastoSeleccionado()) {
              <button type="submit" [disabled]="gastoForm.invalid" 
                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed">
                Actualizar
              </button>
              <button type="button" (click)="cancelar()" class="w-1/3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl transition-all">
                Cancelar
              </button>
            } @else {
              <button type="submit" [disabled]="gastoForm.invalid"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                + Añadir Gasto
              </button>
            }
          </div>
        </div>

      </form>
    </section>
  `
})
/**
 * Componente de formulario para añadir o editar gastos.
 * Maneja la lógica de validación con Reactive Forms.
 */
export class GastoFormComponent {
  public gs = inject(GastoService);
  private fb = inject(FormBuilder);

  /** Controla la visibilidad del input adicional */
  mostrarOtroInput = signal(false);

  gastoForm: FormGroup = this.fb.group({
    descripcion: ['', Validators.required],
    monto: ['', [Validators.required, Validators.min(0.01)]],
    categoria: ['Comida', Validators.required],
    fecha: [new Date().toISOString().split('T')[0], Validators.required],
    detalles: [''],
    otrosDescripcion: ['']
  });

  constructor() {
    // Efecto para cargar datos en edición
    effect(() => {
      const g = this.gs.gastoSeleccionado();
      if (g) {
        this.gastoForm.patchValue({
          descripcion: g.descripcion,
          monto: g.monto,
          categoria: g.categoria,
          fecha: g.fecha,
          detalles: g.detalles || '',
          otrosDescripcion: g.otrosDescripcion || ''
        });
        this.verificarCategoria();
      }
    });
  }

  /** Verifica si mostrar input extra y actualiza validadores */
  verificarCategoria() {
    const cat = this.gastoForm.get('categoria')?.value;
    const esOtros = cat === 'Otros';
    this.mostrarOtroInput.set(esOtros);

    const controlOtros = this.gastoForm.get('otrosDescripcion');
    if (esOtros) {
      controlOtros?.setValidators([Validators.required]);
    } else {
      controlOtros?.clearValidators();
      controlOtros?.setValue('');
    }
    controlOtros?.updateValueAndValidity();
  }

  /** Helper para validar vista */
  esInvalido(campo: string): boolean | undefined {
    const control = this.gastoForm.get(campo);
    return control?.invalid && control?.touched;
  }

  /** Guarda o actualiza el gasto */
  guardar() {
    if (this.gastoForm.invalid) {
      this.gastoForm.markAllAsTouched();
      return;
    }

    const val = this.gastoForm.value;

    if (this.gs.gastoSeleccionado()) {
      this.gs.editar(
        this.gs.gastoSeleccionado()!.id,
        val.descripcion,
        Number(val.monto),
        val.categoria,
        val.fecha,
        val.detalles,
        val.otrosDescripcion
      );
    } else {
      this.gs.agregar(
        val.descripcion,
        Number(val.monto),
        val.categoria,
        val.fecha,
        val.detalles,
        val.otrosDescripcion
      );
    }
    this.limpiar();
  }

  /** Cancela edición y resetea formulario */
  cancelar() {
    this.gs.cancelarEdicion();
    this.limpiar();
  }

  private limpiar() {
    this.gastoForm.reset({
      categoria: 'Comida',
      fecha: new Date().toISOString().split('T')[0]
    });
    this.verificarCategoria();
  }
}
