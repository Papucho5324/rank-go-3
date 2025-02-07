import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, collectionData, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcursantesService {
  constructor(private firestore: Firestore) {} // 🔥 Inyectamos Firestore aquí

  /** ✅ Agrega un concursante a Firestore */
  async agregarConcursante(nombre: string, categoria: string, evaluado: boolean): Promise<void> {
    try {
      const concursantesRef = collection(this.firestore, 'concursantes');
      await addDoc(concursantesRef, { nombre, categoria, evaluado });
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

  /** ✅ Actualiza la información de un concursante */
  async actualizarConcursante(id: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.firestore, `concursantes/${id}`);
      await updateDoc(docRef, data);
      console.log(`✅ Concursante con ID ${id} actualizado correctamente`);
    } catch (error) {
      console.error(`❌ Error al actualizar concursante con ID ${id}:`, error);
      throw error; // Se lanza el error para que el código que lo llame pueda manejarlo
    }
  }

  /** ✅ Guarda una evaluación en Firestore */
  async guardarEvaluacion(evaluacion: any) {
    try {
      const evaluacionesRef = collection(this.firestore, 'evaluaciones'); // Colección en Firestore
      await addDoc(evaluacionesRef, evaluacion);
      console.log("✅ Evaluación guardada en Firestore.");
    } catch (error) {
      console.error("❌ Error al guardar la evaluación:", error);
    }
  }
}
