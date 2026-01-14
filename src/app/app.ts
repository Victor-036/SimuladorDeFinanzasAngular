import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { GastoFormComponent } from './components/gasto-form/gasto-form.component';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { GastoService } from './services/gasto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, GastoFormComponent, GastoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // Solo inyectamos el servicio para que la app funcione,
  // pero ya NO necesitamos la función 'enviar' aquí.
  public gs = inject(GastoService);
}
