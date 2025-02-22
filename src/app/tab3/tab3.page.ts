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
  ordenSeleccionado: string = 'default'; // 🔹 Nuevo: opción de ordenamiento

  constructor(
    private resultadosService: ResultadosService,
    private concursantesService: ConcursantesService
  ) {}

  ngOnInit() {
    this.concursantesService.obtenerConcursantes().subscribe(concursantes => {
      this.concursantes = concursantes.map(concursante => ({
        ...concursante,
        totalPuntos: 0
      }));

      // 🔄 Suscribir cada concursante a su puntuación en tiempo real
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

  /** 🔹 Filtrar y ordenar concursantes según la selección del usuario */
  getConcursantesFiltrados() {
    let concursantesFiltrados = this.categoriaSeleccionada
      ? this.concursantes.filter(concursante => concursante.categoria === this.categoriaSeleccionada)
      : [...this.concursantes];

    // 🔹 Aplicar ordenación según la selección
    if (this.ordenSeleccionado === 'mayor') {
      return concursantesFiltrados.sort((a, b) => b.totalPuntos - a.totalPuntos);
    }
    if (this.ordenSeleccionado === 'menor') {
      return concursantesFiltrados.sort((a, b) => a.totalPuntos - b.totalPuntos);
    }
    return concursantesFiltrados; // Default: sin orden específico
  }
}
