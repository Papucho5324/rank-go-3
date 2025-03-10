import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth-service.service';
import { SafeArea } from 'capacitor-plugin-safe-area';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(private authService:AuthService) {
    this.setDarkMode();
    this.setSafeArea();
  }

  async setSafeArea() {
    const { insets } = await SafeArea.getSafeAreaInsets();
    document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
    document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`);
    document.body.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`);
    document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
  }

  setDarkMode() {
    document.body.classList.add('dark'); // ✅ Activa el modo oscuro por defecto
  }



  async ngOnInit() {
    this.authService.observarUsuario();
  }
}
