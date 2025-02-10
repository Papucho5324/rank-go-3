import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return new Observable((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          observer.next(true); // 🔹 Usuario autenticado, permitir acceso
        } else {
          this.router.navigate(['/login']); // 🔹 Redirigir a login
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
