import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  constructor(private firestore: Firestore) {}

  /** ✅ Obtiene concursantes evaluados, calcula la puntuación total y los ordena alfabéticamente */
  obtenerConcursantesEvaluados(): Observable<any[]> {
    const concursantesRef = collection(this.firestore, 'concursantes');
    return collectionData(concursantesRef, { idField: 'id' }).pipe(
      map(concursantes =>
        concursantes
          .map(concursante => {
            let totalPuntos = 0;
            let numEvaluaciones = 0;
            const nombre = concursante['nombre'] || '';

            if (concursante['evaluaciones']) {
              const evaluacionesArray = Object.values(concursante['evaluaciones']) as any[];
              evaluacionesArray.forEach(evaluacion => {
                totalPuntos += evaluacion.puntuacion;
                numEvaluaciones++;
              });
            }

            return {
              ...concursante,
              nombre,
              totalPuntos,
              promedio: numEvaluaciones ? totalPuntos / numEvaluaciones : 0
            };
          })
          .sort((a, b) => a.nombre.localeCompare(b.nombre)) // ✅ Ordenar alfabéticamente
      )
    );
  }
}
