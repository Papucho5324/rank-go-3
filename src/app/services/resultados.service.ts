import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  constructor(private firestore: Firestore) {}

  /** ✅ Obtiene concursantes evaluados y los ordena alfabéticamente */
  obtenerConcursantesEvaluados(): Observable<any[]> {
    const concursantesRef = collection(this.firestore, 'concursantes');
    return collectionData(concursantesRef, { idField: 'id' }).pipe(
      map(concursantes =>
        concursantes
          .filter(concursante => concursante['evaluado']) // 🔹 Filtrar solo evaluados
          .sort((a, b) => a['nombre'].localeCompare(b['nombre'])) // 🔹 Orden alfabético
      )
    );
  }
}

