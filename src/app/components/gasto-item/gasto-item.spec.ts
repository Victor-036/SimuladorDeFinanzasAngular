import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GastoItemComponent } from './gasto-item.component'; // Ruta corregida

describe('GastoItemComponent', () => {
  let component: GastoItemComponent;
  let fixture: ComponentFixture<GastoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser un componente Standalone, se pone en imports
      imports: [GastoItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GastoItemComponent);
    component = fixture.componentInstance;

    // Nota: Como usa Signal Inputs requeridos, a veces el test falla
    // si no le pasas un objeto 'item' inicial, pero esto arregla el error de compilación.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
