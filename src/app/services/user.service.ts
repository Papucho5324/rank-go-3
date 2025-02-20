import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  obtenerDatosUsuario(): Observable<any> {
    return user(this.auth).pipe(
      switchMap(usuario => {
        if (!usuario) return of(null); // Si no hay usuario autenticado, retorna null
        const userRef = doc(this.firestore, `usuarios/${usuario.uid}`);
        return docData(userRef);
      })
    );
  }
}
