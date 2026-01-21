import { Injectable, signal, computed, effect } from '@angular/core';
import { Gasto } from '../interfaces/gasto.interface';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private storageKey = 'mis_gastos_daw';

  // --- ESTADO BASE ---
  gastos = signal<Gasto[]>(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));
  presupuestoLimite = signal<number>(1000);
  gastoSeleccionado = signal<Gasto | null>(null);

  // --- FILTROS ---
  busqueda = signal<string>('');
  categoriaFiltro = signal<string>('TODAS');

  // --- MOTOR DE FILTRADO ---
  gastosVisibles = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const cat = this.categoriaFiltro();

    return this.gastos().filter(g => {
      const coincideTexto = g.descripcion.toLowerCase().includes(texto);
      const coincideCat = cat === 'TODAS' || g.categoria === cat;
      return coincideTexto && coincideCat;
    });
  });

  // --- CÁLCULOS FINANCIEROS ---
  total = computed(() => this.gastos().reduce((acc, g) => acc + g.monto, 0));
  porcentaje = computed(() => this.presupuestoLimite() === 0 ? 0 : (this.total() / this.presupuestoLimite()) * 100);
  estado = computed(() => {
    if (this.porcentaje() >= 100) return 'CRITICO';
    if (this.porcentaje() >= 75) return 'ALERTA';
    return 'OK';
  });

  constructor() {
    effect(() => localStorage.setItem(this.storageKey, JSON.stringify(this.gastos())));
  }

  // --- ACCIONES (CRUD) ---
  agregar(desc: string, monto: number, cat: any, fecha: string) {
    const nuevo: Gasto = { id: Date.now(), descripcion: desc, monto, categoria: cat, fecha };
    this.gastos.update(g => [nuevo, ...g]);
  }

  editar(id: number, desc: string, monto: number, cat: any, fecha: string) {
    this.gastos.update(lista => lista.map(g =>
      g.id === id ? { ...g, descripcion: desc, monto, categoria: cat, fecha } : g
    ));
    this.gastoSeleccionado.set(null);
  }

  borrar(id: number) {
    this.gastos.update(g => g.filter(item => item.id !== id));
  }

  // --- HELPERS ---
  seleccionarParaEditar(gasto: Gasto) { this.gastoSeleccionado.set(gasto); }
  cancelarEdicion() { this.gastoSeleccionado.set(null); }
  actualizarPresupuesto(val: number) { this.presupuestoLimite.set(val); }
  filtrarPorTexto(t: string) { this.busqueda.set(t); }
  filtrarPorCategoria(c: string) { this.categoriaFiltro.set(c); }

}
