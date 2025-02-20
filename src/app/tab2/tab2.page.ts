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
  promedio: number = 0;


  rubricas: Record<string, { nombre: string; puntuacion: number | null; descripcion: string }[]> = {
    'Talento Escenico': [
      { nombre: 'Manejo del escenario', puntuacion: null, descripcion: 'Evalúa la interacción con el espacio escénico y la seguridad del concursante.' },
      { nombre: 'Expresión corporal', puntuacion: null, descripcion: 'Se mide la postura, movimientos y conexión con el público.' },
      { nombre: 'Vestuario', puntuacion: null, descripcion: 'Se valora la estética y creatividad en la vestimenta acorde a la presentación.' },
      { nombre: 'Aceptación del público', puntuacion: null, descripcion: 'Capacidad del concursante para captar y cautivar al público.' }
    ],
    'Talento Creativo': [
      { nombre: 'Creatividad', puntuacion: null, descripcion: 'Se evalúa la originalidad en la presentación, uso del espacio y materiales.' },
      { nombre: 'Complejidad', puntuacion: null, descripcion: 'Nivel de dificultad técnica y desarrollo de la presentación.' },
      { nombre: 'Presentación', puntuacion: null, descripcion: 'Se analiza la organización, coherencia y dominio del contenido.' },
      { nombre: 'Aceptación del público', puntuacion: null, descripcion: 'Impacto y conexión con la audiencia.' }
    ],
    'Otros Talentos': [
      { nombre: 'Presentación', puntuacion: null, descripcion: 'Orden, coherencia y dominio de la presentación.' },
      { nombre: 'Manejo escénico', puntuacion: null, descripcion: 'Habilidad para interactuar con el escenario con seguridad.' },
      { nombre: 'Dominio, armonía y técnica', puntuacion: null, descripcion: 'Control, armonía y ejecución técnica en la presentación.' },
      { nombre: 'Aceptación del público', puntuacion: null, descripcion: 'Recepción y nivel de impacto en la audiencia.' }
    ],
    'Oficios': [
      { nombre: 'Presentación', puntuacion: null, descripcion: 'Estructura organizada y clara de la presentación.' },
      { nombre: 'Dominio del oficio', puntuacion: null, descripcion: 'Manejo experto y seguridad en la ejecución.' },
      { nombre: 'Complejidad', puntuacion: null, descripcion: 'Nivel de dificultad de la actividad desempeñada.' },
      { nombre: 'Aceptación del público', puntuacion: null, descripcion: 'Reacción y participación del público.' }
    ],
    'Canto': [
      { nombre: 'Técnica vocal', puntuacion: null, descripcion: 'Dominio técnico de la voz, respiración y proyección.' },
      { nombre: 'Afinación', puntuacion: null, descripcion: 'Precisión en la entonación y corrección melódica.' },
      { nombre: 'Interpretación', puntuacion: null, descripcion: 'Expresión emocional y conexión con la letra de la canción.' },
      { nombre: 'Presencia escénica', puntuacion: null, descripcion: 'Impacto visual y confianza sobre el escenario.' }
    ],
    'Coreografía': [
      { nombre: 'Coreografía', puntuacion: null, descripcion: 'Diseño del movimiento y técnica de los bailarines.' },
      { nombre: 'Grado de Dificultad', puntuacion: null, descripcion: 'Complejidad y variedad en los movimientos.' },
      { nombre: 'Ritmo', puntuacion: null, descripcion: 'Coordinación con la música y precisión en la ejecución.' },
      { nombre: 'Calidad interpretativa', puntuacion: null, descripcion: 'Integración de expresión, movimientos y escenografía.' },
      { nombre: 'Vestuario', puntuacion: null, descripcion: 'Adecuación del vestuario al estilo de baile.' }
    ],
    'Musico': [
      { nombre: 'Técnica instrumental', puntuacion: null, descripcion: 'Dominio y precisión en el uso del instrumento.' },
      { nombre: 'Afinación', puntuacion: null, descripcion: 'Precisión en las notas y armonización con el conjunto.' },
      { nombre: 'Interpretación', puntuacion: null, descripcion: 'Expresión artística y sentimiento en la ejecución.' },
      { nombre: 'Presencia escénica', puntuacion: null, descripcion: 'Seguridad y proyección en el escenario.' }
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

  //** 🔹 Obtiene los concursantes faltantes por evaluar al cargar la página */
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
    this.categoriaSeleccionada = this.concursanteSeleccionado.categoria.trim();

    // 🔹 Normalizar la categoría seleccionada (elimina tildes)
    const categoriaNormalizada = this.categoriaSeleccionada.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 🔹 Crear un objeto de rubricas con claves normalizadas
    const rubricasNormalizadas = Object.keys(this.rubricas).reduce((acc, key) => {
      const keyNormalizada = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      acc[keyNormalizada] = this.rubricas[key];
      return acc;
    }, {} as Record<string, any>);

    console.log("📌 Categoría seleccionada:", this.categoriaSeleccionada);
    console.log("📌 Categoría normalizada:", categoriaNormalizada);
    console.log("📌 Claves disponibles en rubricas:", Object.keys(rubricasNormalizadas));

    this.rubricaActual = rubricasNormalizadas[categoriaNormalizada]
      ? rubricasNormalizadas[categoriaNormalizada].map((aspecto: { nombre: string; puntuacion: number | null; descripcion: string }) => ({ nombre: aspecto.nombre, puntuacion: aspecto.puntuacion, descripcion: aspecto.descripcion }))
      : [];

    console.log("📌 Rúbrica cargada:", this.rubricaActual);
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

    // 🔹 Calcular el promedio de la evaluación
    const totalPuntos = this.rubricaActual.reduce((sum, aspecto) => sum + (aspecto.puntuacion ?? 0), 0);

    const evaluacion = {
      concursante: this.concursanteSeleccionado.nombre,
      categoria: this.categoriaSeleccionada,
      // aspectos: this.rubricaActual,
      totalPuntos: totalPuntos,
      observaciones: this.observaciones,
      fecha: new Date()
    };

    try {
      await this.concursantesService.guardarEvaluacion(evaluacion);

      // 🔹 Actualizar el estado del concursante en Firebase
      await this.concursantesService.actualizarConcursante(this.concursanteSeleccionado.id);

      alert('✅ Evaluación guardada correctamente.');

      // 🔹 Eliminar al concursante de la lista en la UI
      this.concursantes = this.concursantes.filter(c => c !== this.concursanteSeleccionado);

      // 🔹 Limpiar valores después de guardar
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
