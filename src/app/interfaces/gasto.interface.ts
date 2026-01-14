export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  categoria: 'Comida' | 'Ocio' | 'Transporte' | 'Otros';
  fecha: string;
}
