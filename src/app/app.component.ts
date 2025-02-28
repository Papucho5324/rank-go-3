import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(private authService:AuthService) {
    this.setDarkMode();
  }
  

  setDarkMode() {
    document.body.classList.add('dark'); // ✅ Activa el modo oscuro por defecto
  }



  async ngOnInit() {
    this.authService.observarUsuario();
  }
}
