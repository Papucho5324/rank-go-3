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
    const concursantesRef = collection(this.firestore, 'evaluaciones');
    return collectionData(concursantesRef, { idField: 'id' })
  }
}

