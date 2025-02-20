import { inject, Injectable, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, UserCredential, onAuthStateChanged } from '@angular/fire/auth';
import { setDoc, doc, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);

  constructor() {
    console.log("✅ AuthService inicializado correctamente");
  }

  observarUsuario() {
    onAuthStateChanged(this.auth, (user) => {
      this.ngZone.run(() => {
        if (user) {
          console.log("✅ Usuario autenticado:", user.uid);
        } else {
          console.log("⚠ No hay usuario autenticado.");
        }
      });
    });
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('❌ Error en el inicio de sesión:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      throw error;
    }
  }

  async registrarAdmin(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guardar el usuario en Firestore con rol de admin
      await setDoc(doc(this.firestore, "usuarios", user.uid), {
        nombre: "Administrador",
        email: email,
        rol: "admin"
      });

      return "Administrador creado exitosamente";
    } catch (error) {
      console.error("Error al crear el administrador", error);
      return (error as any).message;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('❌ Error al enviar el correo de restablecimiento de contraseña:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }
}
