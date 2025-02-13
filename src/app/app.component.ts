import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  menuOpciones: string[] = [];
  constructor(private userService: UserService) {}

  async verificarAcceso() {
    const rol = await this.userService.obtenerRolUsuario();
    if (rol === "admin") {
      this.menuOpciones = ["dashboard", "concursantes", "evaluaciones"];
    } else if (rol === "juez") {
      this.menuOpciones = ["Evaluaciones"];
    }
  }

  async ngOnInit() {
    await this.verificarAcceso();
  }
}
