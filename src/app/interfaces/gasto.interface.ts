export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  categoria: 'Comida' | 'Ocio' | 'Transporte' | 'Otros';
  fecha: string;
  detalles?: string; // Nuevo campo opcional
  otrosDescripcion?: string; // Para especificar cuando es "Otros"
}
