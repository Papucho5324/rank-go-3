import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { ConcursantesService } from '../services/concursantes.service';
import { InteractionService } from '../services/interaction.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  private auth = inject(Auth);
  concursantes: any[] = [];
  concursanteSeleccionado: any = null;
  categoriaSeleccionada: string = '';
  observaciones: string = '';
  rubricaActual: any[] = [];

  rubricas: Record<string, { nombre: string; puntuacion: number | null }[]> = {
    'Talento Escenico': [
      { nombre: 'Manejo del escenario', puntuacion: null },
      { nombre: 'Expresión corporal', puntuacion: null },
      { nombre: 'Vestuario', puntuacion: null },
      { nombre: 'Aceptación del público', puntuacion: null }
    ],
    'Talento Creativo': [
      { nombre: 'Creatividad', puntuacion: null },
      { nombre: 'Complejidad', puntuacion: null },
      { nombre: 'Presentación', puntuacion: null },
      { nombre: 'Aceptación del público', puntuacion: null }
    ],
    'Otros Talentos': [
      { nombre: 'Presentación', puntuacion: null },
      { nombre: 'Manejo escénico', puntuacion: null },
      { nombre: 'Dominio, armonía y técnica', puntuacion: null },
      { nombre: 'Aceptación del público', puntuacion: null }
    ],
    'Oficios': [
      { nombre: 'Presentación', puntuacion: null },
      { nombre: 'Dominio del oficio', puntuacion: null },
      { nombre: 'Complejidad', puntuacion: null },
      { nombre: 'Aceptación del público', puntuacion: null }
    ],
    'Canto': [
      { nombre: 'Técnica vocal', puntuacion: null },
      { nombre: 'Afinación', puntuacion: null },
      { nombre: 'Interpretación', puntuacion: null },
      { nombre: 'Presencia escénica', puntuacion: null }
    ],
    'Coreografía': [
      { nombre: 'Coreografía', puntuacion: null },
      { nombre: 'Grado de Dificultad', puntuacion: null },
      { nombre: 'Ritmo', puntuacion: null },
      { nombre: 'Calidad interpretativa', puntuacion: null },
      { nombre: 'Vestuario', puntuacion: null }
    ],
    'Musico': [
      { nombre: 'Técnica instrumental', puntuacion: null },
      { nombre: 'Afinación', puntuacion: null },
      { nombre: 'Interpretación', puntuacion: null },
      { nombre: 'Presencia escénica', puntuacion: null }
    ]
  };

  constructor(
    private navCtrl: NavController,
    private concursantesService: ConcursantesService,
    private interactionService: InteractionService,
    private cdr: ChangeDetectorRef
  ) {}

  /** 🔹 Cierra sesión del usuario */
  logout(): void {
    console.log("🔹 Intentando cerrar sesión...");
    signOut(this.auth)
      .then(() => {
        console.log('✅ Sesión cerrada correctamente');
        this.navCtrl.navigateRoot('/login');
      })
      .catch(error => {
        console.error('❌ Error al cerrar sesión:', error);
      });
  }

  /** 🔹 Obtiene los concursantes al cargar la página */
  ngOnInit() {
    this.concursantesService.obtenerConcursantes().subscribe(data => {
      this.concursantes = data.filter(concursante => !concursante.evaluado);
      console.log("📌 Concursantes disponibles para evaluar:", this.concursantes);
      this.cdr.detectChanges();
    });
  }

  /** 🔹 Cargar la categoría y la rúbrica correspondiente */
  cargarCategoriaYRubrica() {
    if (this.concursanteSeleccionado) {
      this.categoriaSeleccionada = this.concursanteSeleccionado.categoria;

      // Si la categoría tiene una rúbrica definida, la asigna. Si no, deja un arreglo vacío.
      this.rubricaActual = this.rubricas[this.categoriaSeleccionada]
        ? JSON.parse(JSON.stringify(this.rubricas[this.categoriaSeleccionada]))
        : [];

      console.log("📌 Rúbrica cargada para:", this.categoriaSeleccionada, this.rubricaActual);
      this.cdr.detectChanges();
    } else {
      console.warn("⚠️ No se ha seleccionado ningún concursante.");
      this.categoriaSeleccionada = '';
      this.rubricaActual = [];
    }
  }

  /** 🔹 Guardar la evaluación en Firebase */
  async guardarEvaluacion() {
    if (!this.concursanteSeleccionado) {
      alert('⚠️ Debes seleccionar un concursante antes de guardar.');
      return;
    }

    if (this.rubricaActual.length === 0) {
      alert('⚠️ No hay una rúbrica disponible para esta categoría.');
      return;
    }

    if (this.rubricaActual.some(aspecto => aspecto.puntuacion === null)) {
      alert('⚠️ Debes evaluar todos los aspectos antes de guardar.');
      return;
    }

    const evaluacion = {
      concursante: this.concursanteSeleccionado.nombre,
      categoria: this.categoriaSeleccionada,
      aspectos: this.rubricaActual,
      observaciones: this.observaciones,
      fecha: new Date()
    };

    try {
      await this.concursantesService.guardarEvaluacion(evaluacion);
      alert('✅ Evaluación guardada correctamente.');

      // Marcar el concursante como evaluado
      this.concursanteSeleccionado.evaluado = true;
      this.concursantes = this.concursantes.filter(c => c !== this.concursanteSeleccionado);
      this.concursanteSeleccionado = null;
      this.categoriaSeleccionada = '';
      this.rubricaActual = [];
      this.observaciones = '';

      this.cdr.detectChanges();
    } catch (error) {
      console.error("❌ Error al guardar la evaluación:", error);
      alert("❌ Ocurrió un error al guardar la evaluación.");
    }
  }
}
