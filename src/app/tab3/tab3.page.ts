import { Component, OnInit } from '@angular/core';
import { ResultadosService } from '../services/resultados.service';
import { ConcursantesService } from '../services/concursantes.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  evaluaciones: any[] = [];
  categorias: string[] = [];
  concursantes: any[] = [];

  constructor(
    private resultadosService: ResultadosService,
    private concursantesService: ConcursantesService
  ) {}

  ngOnInit() {
    // 🔄 Obtener concursantes y calcular la puntuación total
    this.concursantesService.obtenerConcursantes().subscribe(concursantes => {
      this.concursantes = concursantes.map(concursante => {
        let totalPuntos = 0;
        let numEvaluaciones = 0;

        // ✅ Convertir las evaluaciones a un array
        if (concursante.evaluaciones) {
          const evaluacionesArray = Object.values(concursante.evaluaciones) as any[];
          evaluacionesArray.forEach(evaluacion => {
            totalPuntos += evaluacion.puntuacion;
            numEvaluaciones++;
          });
        }

        return {
          ...concursante,
          totalPuntos,
          promedio: numEvaluaciones ? totalPuntos / numEvaluaciones : 0
        };
      });
    });

    // 🔄 Obtener las evaluaciones generales
    this.resultadosService.obtenerConcursantesEvaluados().subscribe(data => {
      this.evaluaciones = data;
      this.categorias = [...new Set(data.map(e => e.categoria))]; // 🔹 Obtener categorías únicas
      console.log('📌 Evaluaciones obtenidas:', this.evaluaciones);
    });
  }

  /** 🔹 Filtra los concursantes por categoría */
  getConcursantesPorCategoria(categoria: string) {
    return this.concursantes
      .filter(concursante => concursante.categoria === categoria)
      .map(concursante => ({
        nombre: concursante.nombre,
        calificacion: concursante.totalPuntos,
      }));
  }
}
