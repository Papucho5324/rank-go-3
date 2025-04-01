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
  ordenSeleccionado: string = 'mayor';

  expandedConcursanteId: string | null = null;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;

  doRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.ngOnInit();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

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

   // Método para alternar la expansión de un concursante
   toggleConcursanteExpanded(concursanteId: string) {
    if (this.expandedConcursanteId === concursanteId) {
      // Si ya está expandido, lo cerramos
      this.expandedConcursanteId = null;
    } else {
      // Si no está expandido, lo expandimos y cargamos la información adicional
      this.expandedConcursanteId = concursanteId;
      this.cargarInformacionAdicional(concursanteId);
    }
  }

    // Método para cargar la información adicional del concursante
    cargarInformacionAdicional(concursanteId: string) {
      // Verificamos si ya tenemos la información cargada
      const concursante = this.concursantes.find(c => c.id === concursanteId);

      // Si no tenemos los datos de integrantes o turno, los cargamos
      if (concursante && (!concursante.participantes
        || !concursante.turno)) {
        this.concursantesService.obtenerDetallesConcursante(concursanteId).subscribe(detalles => {
          // Actualizamos el concursante con la información adicional
          const index = this.concursantes.findIndex(c => c.id === concursanteId);
          if (index !== -1) {
            this.concursantes[index] = {
              ...this.concursantes[index],
              participantes: detalles.participantes,
              turno: detalles.turno
              // Añade aquí más campos si lo necesitas
            };
          }
        });
      }
    }

  /** 🔹 Filtrar y ordenar concursantes según la selección del usuario */
  getConcursantesFiltrados() {
    let concursantesFiltrados = this.categoriaSeleccionada
      ? this.concursantes.filter(concursante => concursante.categoria === this.categoriaSeleccionada)
      : [...this.concursantes];

    // 🔹 Aplicar ordenación según la selección
    if (this.ordenSeleccionado === 'mayor') {
      concursantesFiltrados.sort((a, b) => b.totalPuntos - a.totalPuntos);
    } else if (this.ordenSeleccionado === 'menor') {
      concursantesFiltrados.sort((a, b) => a.totalPuntos - b.totalPuntos);
    }

    // 🔹 Concatenar la categoría solo si se selecciona "Todas"
    return concursantesFiltrados.map(concursante => ({
      ...concursante,
      nombre:
        this.categoriaSeleccionada === ''
          ? `${concursante.nombre} (${concursante.categoria})`
          : concursante.nombre
    }));
  }

  /** 🔹 Obtener concursantes para la página actual */
  getConcursantesPaginados() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.getConcursantesFiltrados().slice(startIndex, endIndex);
  }

  /** 🔹 Cambiar de página */
  changePage(page: number) {
    this.currentPage = page;
  }

  /** 🔹 Obtener el número total de páginas */
  getTotalPages() {
    return Math.ceil(this.getConcursantesFiltrados().length / this.itemsPerPage);
  }
}
