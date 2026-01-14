import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GastoListComponent } from './gasto-list.component'; // Ruta y clase corregidas
import { GastoService } from '../../services/gasto.service'; // Necesario para que el test no falle

describe('GastoListComponent', () => {
  let component: GastoListComponent;
  let fixture: ComponentFixture<GastoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser standalone, lo ponemos en imports
      imports: [GastoListComponent],
      // Proveemos el servicio porque el componente lo inyecta
      providers: [GastoService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GastoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
