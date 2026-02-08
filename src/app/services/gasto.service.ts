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

  // --- LÓGICA COMPUTADA ---
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
    if (p >= 66) return 'ALERTA'; // 2/3 del presupuesto
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

  /**
   * Carga los gastos del usuario actual desde el servidor.
   * También recupera el presupuesto personalizado del localStorage.
   */
  cargarDatos() {
    const usuario = this.auth.currentUser();
    if (!usuario) return;

    // 1. Cargar Gastos
    this.http.get<Gasto[]>(`${this.apiUrl}?usuarioId=${usuario.id}`).subscribe({
      next: (datos) => {
        this.gastos.set(datos.reverse());
      },
      error: (e) => console.error('Error cargando gastos:', e)
    });

    // 2. Cargar Presupuesto Personalizado
    const presupuestoGuardado = localStorage.getItem(`presupuesto_${usuario.id}`);
    if (presupuestoGuardado) {
      this.presupuestoLimite.set(Number(presupuestoGuardado));
    } else {
      this.presupuestoLimite.set(1000); // Por defecto
    }
  }

  /**
   * Crea un nuevo gasto y lo asocia al usuario actual.
   * @param desc Descripción del gasto
   * @param monto Cantidad en euros
   * @param cat Categoría del gasto
   * @param fecha Fecha del gasto
   * @param detalles Detalles adicionales (opcional)
   * @param otrosDesc Descripción si la categoría es 'Otros' (opcional)
   */
  agregar(desc: string, monto: number, cat: any, fecha: string, detalles?: string, otrosDesc?: string) {
    const usuario = this.auth.currentUser();
    if (!usuario) {
      alert('Error: No hay usuario identificado');
      return;
    }

    // AÑADIMOS EL ID DEL USUARIO AL GASTO
    const nuevoGasto: any = {
      descripcion: desc,
      monto,
      categoria: cat,
      fecha,
      usuarioId: usuario.id,
      detalles: detalles || '',
      otrosDescripcion: cat === 'Otros' ? (otrosDesc || '') : ''
    };

    this.http.post<Gasto>(this.apiUrl, nuevoGasto).subscribe({
      next: (gastoGuardado) => {
        this.gastos.update(actuales => [gastoGuardado, ...actuales]);
      },
      error: (e) => console.error('Error guardando:', e)
    });
  }

  /**
   * Actualiza un gasto existente.
   * @param id ID del gasto a editar
   */
  editar(id: number, desc: string, monto: number, cat: any, fecha: string, detalles?: string, otrosDesc?: string) {
    const usuario = this.auth.currentUser();
    if (!usuario) return;

    // Mantenemos el usuarioId al editar
    const gastoEditado: any = {
      descripcion: desc,
      monto,
      categoria: cat,
      fecha,
      usuarioId: usuario.id,
      detalles: detalles || '',
      otrosDescripcion: cat === 'Otros' ? (otrosDesc || '') : ''
    };

    this.http.put<Gasto>(`${this.apiUrl}/${id}`, gastoEditado).subscribe({
      next: (gasto) => {
        this.gastos.update(lista => lista.map(g => g.id === id ? gasto : g));
        this.cancelarEdicion();
      },
      error: (e) => console.error('Error editando:', e)
    });
  }

  /**
   * Elimina un gasto por su ID.
   */
  borrar(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.gastos.update(g => g.filter(item => item.id !== id));
      },
      error: (e) => console.error('Error borrando:', e)
    });
  }

  // --- MÉTODOS AUXILIARES ---

  /** Selecciona un gasto para mostrarlo en el formulario de edición */
  seleccionarParaEditar(gasto: Gasto) { this.gastoSeleccionado.set(gasto); }

  /** Cancela la edición y limpia la selección */
  cancelarEdicion() { this.gastoSeleccionado.set(null); }

  /**
   * Actualiza el límite del presupuesto y lo guarda en localStorage.
   */
  actualizarPresupuesto(val: number) {
    this.presupuestoLimite.set(val);
    const usuario = this.auth.currentUser();
    if (usuario) {
      localStorage.setItem(`presupuesto_${usuario.id}`, val.toString());
    }
  }

  filtrarPorTexto(t: string) { this.busqueda.set(t); }
  filtrarPorCategoria(c: string) { this.categoriaFiltro.set(c); }
}
