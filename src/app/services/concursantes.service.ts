import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDoc, doc, updateDoc, collectionData, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcursantesService {
  private firestore = inject(Firestore); // 👈 Corrección: usar `inject()`

  constructor(private auth: Auth) {console.log("✅ ConcursantesService inicializado correctamente");}

  /** ✅ Agrega un concursante a Firestore con un registro de jueces evaluadores */
  async agregarConcursante(nombre: string, categoria: string): Promise<void> {
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
      await addDoc(concursantesRef, { nombre, categoria, evaluadoPor: {} }); // 👈 Lista de jueces que evaluaron
      console.log("✅ Concursante agregado correctamente");
    } catch (error) {
      console.error("❌ Error al agregar concursante:", error);
    }
  }

  /** ✅ Obtiene todos los concursantes */
  obtenerConcursantes(): Observable<any[]> {
    const concursantesRef = collection(this.firestore, 'concursantes');
    console.log("📌 Consultando concursantes desde Firestore...");
    return collectionData(concursantesRef, { idField: 'id' });
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

    const nombreJuez = userData.data()['nombre'] || "Juez Desconocido"; // 🏷️ Si no tiene nombre, se asigna un default

    const juezId = user.uid;
    const evaluacionRef = doc(this.firestore, `concursantes/${concursanteId}/evaluaciones/${juezId}`);

    // 📌 Cada juez solo puede agregar su propia evaluación
    await setDoc(evaluacionRef, {
      nombreJuez, // ✅ Guarda el nombre del juez
      puntuacion, // ✅ Guarda la puntuación dada por el juez
      comentarios, // ✅ Guarda los comentarios del juez
      fecha: new Date()
    });

    console.log(`✅ Evaluación guardada por el juez ${nombreJuez} para el concursante ${concursanteId}`);

  } catch (error) {
    console.error("❌ Error al guardar la evaluación:", error);
  }
}


 /** ✅ Obtener todas las evaluaciones de un concursante */
obtenerEvaluaciones(concursanteId: string): Observable<any[]> {
  const evaluacionesRef = collection(this.firestore, `concursantes/${concursanteId}/evaluaciones`);
  return collectionData(evaluacionesRef, { idField: 'id' }); // 📌 Devuelve la lista de evaluaciones con el ID de cada juez
}


  /** ✅ Obtener el total de evaluaciones y puntuaciones de un concursante */
  async obtenerTotalPuntuacion(concursanteId: string): Promise<number> {
    try {
      const evaluacionesRef = collection(this.firestore, `concursantes/${concursanteId}/evaluaciones`);
      const evaluacionesSnapshot = await collectionData(evaluacionesRef).toPromise();

      if (!evaluacionesSnapshot) return 0;

      const totalPuntos = evaluacionesSnapshot.reduce((sum, evalData: any) => sum + evalData.puntuacion, 0);
      return totalPuntos;
    } catch (error) {
      console.error("❌ Error al calcular la puntuación total:", error);
      return 0;
    }
  }

  /** ✅ Obtener los jueces que han evaluado un concursante */
  async obtenerJuecesEvaluadores(concursanteId: string): Promise<string[]> {
    try {
      const concursanteRef = doc(this.firestore, `concursantes/${concursanteId}`);
      const concursanteData = await getDoc(concursanteRef);

      if (concursanteData.exists()) {
        const data = concursanteData.data();
        return Object.keys(data['evaluadoPor'] || {});
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

    // 🔹 Asegurar que evaluadoPor siempre sea un objeto
    const evaluadoPor = data?.['evaluadoPor'] ? { ...data['evaluadoPor'] } : {};

    // 🔹 Agregar el juez actual a la lista de evaluadores
    evaluadoPor[user.uid] = true;

    console.log(`🔹 Antes de actualizar: `, data);
    console.log(`🔹 Actualizando concursante ${concursanteId} con evaluadoPor:`, evaluadoPor);

    // 🔹 Guardar actualización en Firestore
    await updateDoc(concursanteRef, { evaluadoPor });

    console.log(`✅ Concursante ${concursanteId} evaluado por el juez ${user.uid}`);
  } catch (error) {
    console.error(`❌ Error al actualizar el concursante ${concursanteId}:`, error);
    throw error;
  }
}


}
