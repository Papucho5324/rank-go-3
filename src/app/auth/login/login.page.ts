import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showToast: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Puedes eliminar este método si no lo necesitas
  }

  async login(): Promise<void> {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, ingresa un correo y una contraseña.';
      this.showToast = true;
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.errorMessage = '';

    try {
      const userCredential = await this.authService.login(this.email, this.password);

      if (userCredential?.user) {
        console.log('Login exitoso: ', userCredential.user);

        this.ngZone.run(() => {
          this.router.navigate(['/app']);
        });
      } else {
        console.warn('Login no exitoso');
      }
    } catch (error: unknown) {
      console.error('Error en el login:', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
        this.errorMessage = this.getErrorMessage((error as any).code);
      } else {
        this.errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';
      }

      this.showToast = true;
    }
  }

  /**
   * Traduce los códigos de error de Firebase a mensajes amigables para el usuario.
   * @param errorCode Código de error recibido desde Firebase.
   * @returns Mensaje de error en español.
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El formato del correo es inválido.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      'auth/user-not-found': 'No existe una cuenta con este correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/too-many-requests': 'Demasiados intentos, intenta más tarde.'
    };

    return errorMessages[errorCode] || 'Error al iniciar sesión. Verifica tus datos.';
  }
}
