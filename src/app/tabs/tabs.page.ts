import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { ConcursantesService } from '../services/concursantes.service';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit, OnDestroy {
  rolUsuario: string | null = null;
  private userSubscription!: Subscription;
  concursantes$: Observable<any[]> | null = null;
  juezId: string | null = null;

  constructor(private userService: UserService, private concursantesService: ConcursantesService, private auth: Auth) {}

  ngOnInit() {
    // 🔄 Escuchar los cambios en la autenticación
    this.userSubscription = this.userService.obtenerDatosUsuario().subscribe({
      next: (datosUsuario) => {
        this.rolUsuario = datosUsuario?.rol || null;
      },
      error: (err) => console.error('Error al obtener usuario:', err)
    });

    // 🔄 Obtener el usuario autenticado y filtrar concursantes
    const user = this.auth.currentUser;
    if (user) {
      this.juezId = user.uid;
      this.concursantes$ = this.concursantesService.obtenerConcursantes().pipe(
        map(concursantes => concursantes.filter(concursante =>
          !concursante.evaluaciones || (this.juezId && !concursante.evaluaciones[this.juezId])
        ))
      );
    }
  }

  ngOnDestroy() {
    // 🚀 Evita fugas de memoria cerrando la suscripción
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
