import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc,getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth:Auth, private firestore:Firestore
  ) { }

  async obtenerRolUsuario(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(this.firestore, "usuarios", user.uid));
    return userDoc.exists() ? userDoc.data()['rol'] : null;
  }
}
