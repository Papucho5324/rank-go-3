import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  collectionData,
  setDoc,
  collectionSnapshots,
  docData,
  getDocs
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcursantesService {
  private firestore = inject(Firestore);

  constructor(private auth: Auth) {
    console.log("✅ ConcursantesService inicializado correctamente");
  }

  /** ✅ Agrega un concursante a Firestore con un registro de jueces evaluadores */
  async agregarConcursante(nombre: string, categoria: string, turno:string, participantes:string[]): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("No estás autenticado.");
      }

      // 📌 Verificar si el usuario es admin antes de agregar el concursante
      const userDoc = await getDoc(doc(this.firestore, "usuarios", user.uid));
      if (!userDoc.exists() || userDoc.data()['rol'] !== "admin") {
        throw new Error("No tienes permisos para agregar concursantes.");
      }

      const concursantesRef = collection(this.firestore, 'concursantes');
      await addDoc(concursantesRef, { nombre, categoria, turno, participantes, evaluaciones: {} });
      console.log("✅ Concursante agregado correctamente");
    } catch (error) {
      console.error("❌ Error al agregar concursante:", error);
    }
  }

  // Nuevo método para obtener detalles adicionales del concursante
  obtenerDetallesConcursante(concursanteId: string): Observable<any> {
    const concursanteDocRef = doc(this.firestore, `concursantes/${concursanteId}`);
    return docData(concursanteDocRef, { idField: 'id' });
  }

  /** ✅ Obtiene todos los concursantes - MODIFICADO para forzar fetch del servidor */
  obtenerConcursantes(): Observable<any[]> {
    console.log("📌 Consultando concursantes frescos desde Firestore...");
    const concursantesRef = collection(this.firestore, 'concursantes');

    // Usar getDocs para forzar una consulta fresca en cada llamada
    return from(getDocs(concursantesRef)).pipe(
      map(snapshot => {
        const concursantes: any[] = [];
        snapshot.forEach(doc => {
          concursantes.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log(`📌 Obtenidos ${concursantes.length} concursantes frescos`);
        return concursantes;
      })
    );
  }

  /** ✅ Obtener todas las evaluaciones de un concursante - MODIFICADO para forzar fetch */
  obtenerEvaluaciones(concursanteId: string): Observable<any[]> {
    console.log(`📌 Obteniendo evaluaciones frescas para concursante ${concursanteId}...`);
    const evaluacionesRef = collection(this.firestore, `concursantes/${concursanteId}/evaluaciones`);

    // Usar getDocs para forzar una consulta fresca en cada llamada
    return from(getDocs(evaluacionesRef)).pipe(
      map(snapshot => {
        const evaluaciones: any[] = [];
        snapshot.forEach(doc => {
          evaluaciones.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log(`📌 Obtenidas ${evaluaciones.length} evaluaciones frescas`);
        return evaluaciones;
      })
    );
  }

  /** ✅ Guarda una evaluación en la subcolección de cada concursante */
  async guardarEvaluacion(concursanteId: string, puntuacion: number, comentarios: string) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No estás autenticado.");

      // 📌 Obtener el nombre del juez desde la base de datos de usuarios
      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      const userData = await getDoc(userRef);

      if (!userData.exists()) {
        throw new Error("No se encontró información del juez.");
      }

      const nombreJuez = userData.data()['nombre'] || "Juez Desconocido";

      const juezId = user.uid;
      const evaluacionRef = doc(this.firestore, `concursantes/${concursanteId}/evaluaciones/${juezId}`);

      await setDoc(evaluacionRef, {
        nombreJuez,
        puntuacion,
        comentarios,
        fecha: new Date()
      });

      console.log(`✅ Evaluación guardada por el juez ${nombreJuez} para el concursante ${concursanteId}`);

    } catch (error) {
      console.error("❌ Error al guardar la evaluación:", error);
    }
  }

  /** ✅ Obtiene todas las evaluaciones de un concursante y suma sus puntuaciones en tiempo real */
  obtenerTotalPuntuacion(concursanteId: string): Observable<number> {
    const evaluacionesRef = collection(this.firestore, `concursantes/${concursanteId}/evaluaciones`);

    return from(getDocs(evaluacionesRef)).pipe(
      map(snapshot => {
        let total = 0;
        snapshot.forEach(doc => {
          total += doc.data()['puntuacion'] || 0;
        });
        console.log(`📌 Total de puntos actualizado para concursante ${concursanteId}:`, total);
        return total;
      })
    );
  }

  /** ✅ Obtener los jueces que han evaluado un concursante */
  async obtenerJuecesEvaluadores(concursanteId: string): Promise<string[]> {
    try {
      const concursanteRef = doc(this.firestore, `concursantes/${concursanteId}`);
      const concursanteData = await getDoc(concursanteRef);

      if (concursanteData.exists()) {
        const data = concursanteData.data();
        return Object.keys(data['evaluaciones'] || {});
      }

      return [];
    } catch (error) {
      console.error("❌ Error al obtener jueces evaluadores:", error);
      return [];
    }
  }

  /** ✅ Marca a un concursante como evaluado por un juez específico */
  async actualizarConcursante(concursanteId: string) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("❌ No estás autenticado.");

      const concursanteRef = doc(this.firestore, `concursantes/${concursanteId}`);
      const concursanteData = await getDoc(concursanteRef);

      if (!concursanteData.exists()) {
        throw new Error(`❌ Concursante ${concursanteId} no encontrado.`);
      }

      const data = concursanteData.data();
      const evaluadoPor = data?.['evaluaciones'] ? { ...data['evaluaciones'] } : {};
      evaluadoPor[user.uid] = true;

      await updateDoc(concursanteRef, { evaluaciones: evaluadoPor });

      console.log(`✅ Concursante ${concursanteId} evaluado por el juez ${user.uid}`);
    } catch (error) {
      console.error(`❌ Error al actualizar el concursante ${concursanteId}:`, error);
    }
  }

  /** ✅ Limpiar cualquier caché interna si es necesario */
  clearCache() {
    console.log("📌 Limpiando caché del servicio de concursantes");
    // No hay caché interna explícita, pero este método puede ser útil
    // para realizar alguna limpieza adicional si es necesario en el futuro
  }
}
