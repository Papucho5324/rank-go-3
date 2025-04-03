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
  turno: string = "";
  nombreParticipante: string = '';
  participantes: string[] = [];

  // Inyecta los servicios en el constructor
  constructor(
    private concursantesService: ConcursantesService,
    private interactionService: InteractionService
  ) {}

  agregarParticipante(){
    if(this.nombreParticipante.trim()){
      this.participantes.push(this.nombreParticipante.trim());
      this.nombreParticipante = ''; // Restablecer
    }
  }

  async agregarConcursante() {
    if (this.nombre.trim() === "" || this.categoria.trim() === "" || this.turno.trim() === "") {
      console.log("❌ Ingresa un nombre válido");
      return;
    }

    try {
      await this.concursantesService.agregarConcursante(this.nombre, this.categoria, this.turno, this.participantes);
      await this.interactionService.showToast('✅ Concursante agregado con éxito.', 2000, 'top');
      this.nombre = ""; // Limpiar
      this.categoria = "Talento Escenico"; // Restablecer
      this.turno = ""; // Restablecer
      this.participantes = []; // Restablecer
      this.nombreParticipante = ''; // Restablecer
    } catch (error) {
      console.error("❌ Error al agregar concursante:", error);
    }
  }

}
