import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm">

        <h1 class="text-3xl font-black text-center text-indigo-600 mb-2 italic">Financy</h1>
        <p class="text-center text-slate-400 text-sm mb-8">Inicia sesión para gestionar tus gastos</p>

        <form [formGroup]="loginForm" (ngSubmit)="entrar()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input type="email" formControlName="email"
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              [class.ring-red-500]="esInvalido('email')"
              placeholder="admin@daw.com">
            
            @if (esInvalido('email')) {
              @if (loginForm.get('email')?.hasError('required')) {
                <p class="text-red-500 text-xs mt-1 font-bold">El email es obligatorio</p>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <p class="text-red-500 text-xs mt-1 font-bold">Email inválido</p>
              }
            }
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
            <input type="password" formControlName="password"
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              [class.ring-red-500]="esInvalido('password')"
              placeholder="••••••">
            
            @if (esInvalido('password')) {
              <p class="text-red-500 text-xs mt-1 font-bold">La contraseña es obligatoria</p>
            }
          </div>

          @if (error()) {
            <p class="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">
              Usuario o contraseña incorrectos
            </p>
          }

          <button type="submit" [disabled]="loginForm.invalid"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            Entrar
          </button>
        </form>
        
        <div class="mt-8 text-center">
          <p class="text-slate-400 text-sm">
            ¿No tienes cuenta? 
            <a routerLink="/register" class="text-indigo-600 font-bold hover:underline">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  `
})
/**
 * Página de inicio de sesión.
 */
export class LoginComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  error = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  /** Helper para validar vista */
  esInvalido(campo: string): boolean | undefined {
    const control = this.loginForm.get(campo);
    return control?.invalid && control?.touched;
  }

  /** Intenta loguear al usuario con las credenciales introducidas. */
  entrar() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe(exito => {
      if (!exito) {
        this.error.set(true);
      }
    });
  }
}
