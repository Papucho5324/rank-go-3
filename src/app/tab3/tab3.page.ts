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
  categoriaSeleccionada: string = '';

  constructor(
    private resultadosService: ResultadosService,
    private concursantesService: ConcursantesService
  ) {}

  ngOnInit() {
    this.concursantesService.obtenerConcursantes().subscribe(concursantes => {
      this.concursantes = concursantes.map(concursante => ({
        ...concursante,
        totalPuntos: 0 // Inicialmente 0, luego se actualizará
      }));

      // 🔹 Obtener la puntuación total de cada concursante
      this.concursantes.forEach(concursante => {
        this.concursantesService.obtenerTotalPuntuacion(concursante.id).subscribe(total => {
          concursante.totalPuntos = total;
        });
      });
    });

    this.resultadosService.obtenerConcursantesEvaluados().subscribe(data => {
      this.evaluaciones = data;
      this.categorias = [...new Set(data.map(e => e.categoria))];
    });
  }

  getConcursantesFiltrados() {
    if (!this.categoriaSeleccionada) {
      return this.concursantes;
    }
    return this.concursantes.filter(concursante => concursante.categoria === this.categoriaSeleccionada);
  }
}
