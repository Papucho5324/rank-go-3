import { Component } from '@angular/core';
import { ConcursantesService } from '../services/concursantes.service';
import { InteractionService } from '../services/interaction.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,  // o simplemente omítelo si usas módulos
})
export class Tab1Page {
  nombre: string = "";
  categoria: string = "Talento Escenico"; // Valor predeterminado
  evaluado: boolean = false;

  // Inyecta los servicios en el constructor
  constructor(
    private concursantesService: ConcursantesService,
    private interactionService: InteractionService
  ) {}

  async agregarConcursante() {
    if (this.nombre.trim() === "") {
      console.log("❌ Ingresa un nombre válido");
      return;
    }

    try {
      await this.concursantesService.agregarConcursante(this.nombre, this.categoria);
      await this.interactionService.showToast('✅ Concursante agregado con éxito.', 2000, 'top');
      this.nombre = ""; // Limpiar input
    } catch (error) {
      console.error("❌ Error al agregar concursante:", error);
    }
  }

}
