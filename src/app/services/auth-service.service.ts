import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Importa firebase de la versión compat

// Define el tipo usando la definición de firebase/compat
type UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result as UserCredential;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result as UserCredential;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
}
