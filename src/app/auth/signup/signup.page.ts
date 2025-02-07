import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {

   // Propiedades que se vincularán a los campos del formulario.
   name: string = '';
   email: string = '';
   password: string = '';

   // Propiedad para mostrar errores (por ejemplo, campos incompletos o error en el registro).
   errorMessage: string = '';

   constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {

  }

   /**
    * Método que se ejecuta al enviar el formulario de registro.
    * Valida que los campos estén completos y llama al servicio de registro.
    */
   async register() {
     // Validación simple de campos
     if (!this.name || !this.email || !this.password) {
       this.errorMessage = 'Por favor, completa todos los campos.';
       return;
     }

     try {
       // Llamada al método de registro del AuthService
       const userCredential = await this.authService.register(this.email, this.password);
       console.log('Registro exitoso:', userCredential);

       // Redirigir al usuario a la página de login (o a la que consideres apropiada)
       this.router.navigate(['/login']);
     } catch (error: any) {
       console.error('Error en el registro:', error);
       this.errorMessage = error.message || 'Error al registrarse. Intenta nuevamente.';
     }
   }
 }
