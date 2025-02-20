import { Component } from '@angular/core';
import { ResultadosService } from '../services/resultados.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  evaluaciones: any[] = [];
  categorias: string[] = [];

  constructor(private resultadosService:ResultadosService) {}

  ngOnInit() {
    this.resultadosService.obtenerConcursantesEvaluados().subscribe(data => {
      this.evaluaciones = data;
      this.categorias = [...new Set(data.map(e => e.categoria))]; // 🔹 Obtener categorías únicas
      console.log('📌 Evaluaciones obtenidas:', this.evaluaciones);
    });
  }


   /** 🔹 Filtra los concursantes por categoría */
   getConcursantesPorCategoria(categoria: string) {
    return this.evaluaciones
      .filter(e => e.categoria === categoria)
      .map(e => ({
        nombre: e.concursante,
        calificacion: e.totalPuntos,
      }));
  }

}
