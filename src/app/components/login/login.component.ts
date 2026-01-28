import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm">

        <h1 class="text-3xl font-black text-center text-indigo-600 mb-2 italic">Finance SL</h1>
        <p class="text-center text-slate-400 text-sm mb-8">Inicia sesión para gestionar tus gastos</p>

        <form (ngSubmit)="entrar()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email"
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="admin@daw.com">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
            <input type="password" [(ngModel)]="pass" name="password"
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••">
          </div>

          @if (error()) {
            <p class="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">
              Usuario o contraseña incorrectos
            </p>
          }

          <button type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
            Entrar
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  email = '';
  pass = '';
  error = signal(false);

  entrar() {
    this.auth.login(this.email, this.pass).subscribe(exito => {
      if (!exito) {
        this.error.set(true);
      }
    });
  }
}
