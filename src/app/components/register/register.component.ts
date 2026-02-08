import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">

        <div class="text-center mb-8">
          <h1 class="text-3xl font-black italic text-indigo-600 mb-2">Financy</h1>
          <p class="text-slate-500 font-medium">Crea tu cuenta gratis</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="registro()" class="space-y-4">

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nombre</label>
            <input type="text" formControlName="nombre" placeholder="Ej: Juan Pérez"
              class="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700"
              [class.ring-red-500]="esInvalido('nombre')">
            @if (esInvalido('nombre')) {
              <p class="text-red-500 text-xs mt-1 font-bold ml-1">El nombre es obligatorio</p>
            }
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email</label>
            <input type="email" formControlName="email" placeholder="ejemplo@correo.com"
              class="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700"
              [class.ring-red-500]="esInvalido('email')">
             @if (esInvalido('email')) {
              @if (registerForm.get('email')?.hasError('required')) {
                <p class="text-red-500 text-xs mt-1 font-bold ml-1">El email es obligatorio</p>
              }
              @if (registerForm.get('email')?.hasError('email')) {
                <p class="text-red-500 text-xs mt-1 font-bold ml-1">Email inválido</p>
              }
            }
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Contraseña</label>
            <input type="password" formControlName="password" placeholder="••••••••"
              class="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-700"
              [class.ring-red-500]="esInvalido('password')">
             @if (esInvalido('password')) {
               @if (registerForm.get('password')?.hasError('required')) {
                  <p class="text-red-500 text-xs mt-1 font-bold ml-1">La contraseña es obligatoria</p>
               }
               @if (registerForm.get('password')?.hasError('minlength')) {
                  <p class="text-red-500 text-xs mt-1 font-bold ml-1">Mínimo 6 caracteres</p>
               }
             }
          </div>

          @if (error) {
            <div class="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill"></i> {{ error }}
            </div>
          }

          <button type="submit" [disabled]="registerForm.invalid"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span>Registrarme</span> <i class="bi bi-arrow-right"></i>
          </button>

        </form>

        <div class="mt-8 text-center">
          <p class="text-slate-400 text-sm">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-indigo-600 font-bold hover:underline">Inicia Sesión</a>
          </p>
        </div>

      </div>
    </div>
  `
})
/**
 * Página de registro de nuevos usuarios.
 */
export class RegisterComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  error = '';

  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  /** Helper para validar vista */
  esInvalido(campo: string): boolean | undefined {
    const control = this.registerForm.get(campo);
    return control?.invalid && control?.touched;
  }

  /**
   * Maneja el envío del formulario de registro.
   * Valida los datos y llama al servicio de autenticación.
   */
  registro() {
    this.error = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, email, password } = this.registerForm.value;

    this.auth.register(nombre, email, password).subscribe({
      next: () => {
        // La redirección la maneja el servicio
      },
      error: (err) => {
        this.error = 'Ocurrió un error al registrar. Intenta con otro email.';
        console.error(err);
      }
    });
  }
}
