import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit, OnDestroy {
  rolUsuario: string | null = null;
  private userSubscription!: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // 🔄 Escuchar los cambios en la autenticación
    this.userSubscription = this.userService.obtenerDatosUsuario().subscribe({
      next: (datosUsuario) => {
        this.rolUsuario = datosUsuario?.rol || null;
      },
      error: (err) => console.error('Error al obtener usuario:', err)
    });
  }

  ngOnDestroy() {
    // 🚀 Evita fugas de memoria cerrando la suscripción
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
