import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gasto } from '../interfaces/gasto.interface';
import { AuthService } from './auth.service'; // <--- IMPORTANTE: Importar Auth

@Injectable({ providedIn: 'root' })
export class GastoService {
  // Inyecciones
  private http = inject(HttpClient);
  private auth = inject(AuthService); // <--- Necesitamos saber quién es el usuario

  private apiUrl = 'http://localhost:3000/gastos';

  // --- ESTADO (Signals) ---
  gastos = signal<Gasto[]>([]);
  presupuestoLimite = signal<number>(1000);
  gastoSeleccionado = signal<Gasto | null>(null);

  // --- FILTROS DE BÚSQUEDA ---
  busqueda = signal<string>('');
  categoriaFiltro = signal<string>('TODAS');

  // --- LÓGICA COMPUTADA (Igual que antes) ---
  gastosVisibles = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const cat = this.categoriaFiltro();

    return this.gastos().filter(g => {
      const coincideTexto = g.descripcion.toLowerCase().includes(texto);
      const coincideCat = cat === 'TODAS' || g.categoria === cat;
      return coincideTexto && coincideCat;
    });
  });

  total = computed(() => this.gastos().reduce((acc, g) => acc + g.monto, 0));

  porcentaje = computed(() => {
    if (this.presupuestoLimite() === 0) return 0;
    return (this.total() / this.presupuestoLimite()) * 100;
  });

  estado = computed(() => {
    const p = this.porcentaje();
    if (p >= 100) return 'CRITICO';
    if (p >= 75) return 'ALERTA';
    return 'OK';
  });

  constructor() {
    // EFECTO REACTIVO:
    // Cada vez que cambie el usuario (login/logout), recargamos los datos automáticamente.
    effect(() => {
      if (this.auth.currentUser()) {
        this.cargarDatos();
      } else {
        this.gastos.set([]); // Si no hay usuario, limpiamos la lista
      }
    });
  }

  // --- MÉTODOS HTTP ---

  cargarDatos() {
    const usuario = this.auth.currentUser();
    if (!usuario) return;

    // PETICIÓN FILTRADA: ?usuarioId=...
    this.http.get<Gasto[]>(`${this.apiUrl}?usuarioId=${usuario.id}`).subscribe({
      next: (datos) => {
        this.gastos.set(datos.reverse());
      },
      error: (e) => console.error('Error cargando gastos:', e)
    });
  }

  agregar(desc: string, monto: number, cat: any, fecha: string) {
    const usuario = this.auth.currentUser();
    if (!usuario) {
      alert('Error: No hay usuario identificado');
      return;
    }

    // AÑADIMOS EL ID DEL USUARIO AL GASTO
    const nuevoGasto = {
      descripcion: desc,
      monto,
      categoria: cat,
      fecha,
      usuarioId: usuario.id // <--- CLAVE PARA LA RELACIÓN
    };

    this.http.post<Gasto>(this.apiUrl, nuevoGasto).subscribe({
      next: (gastoGuardado) => {
        this.gastos.update(actuales => [gastoGuardado, ...actuales]);
      },
      error: (e) => console.error('Error guardando:', e)
    });
  }

  editar(id: number, desc: string, monto: number, cat: any, fecha: string) {
    const usuario = this.auth.currentUser();
    if (!usuario) return;

    // Mantenemos el usuarioId al editar
    const gastoEditado = {
      descripcion: desc,
      monto,
      categoria: cat,
      fecha,
      usuarioId: usuario.id
    };

    this.http.put<Gasto>(`${this.apiUrl}/${id}`, gastoEditado).subscribe({
      next: (gasto) => {
        this.gastos.update(lista => lista.map(g => g.id === id ? gasto : g));
        this.cancelarEdicion();
      },
      error: (e) => console.error('Error editando:', e)
    });
  }

  borrar(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.gastos.update(g => g.filter(item => item.id !== id));
      },
      error: (e) => console.error('Error borrando:', e)
    });
  }

  // --- HELPERS (Sin cambios) ---
  seleccionarParaEditar(gasto: Gasto) { this.gastoSeleccionado.set(gasto); }
  cancelarEdicion() { this.gastoSeleccionado.set(null); }
  actualizarPresupuesto(val: number) { this.presupuestoLimite.set(val); }
  filtrarPorTexto(t: string) { this.busqueda.set(t); }
  filtrarPorCategoria(c: string) { this.categoriaFiltro.set(c); }
}
