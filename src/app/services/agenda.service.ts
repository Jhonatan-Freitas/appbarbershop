import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Agendamento } from '../entities/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private db: AngularFireDatabase,
    private afs: AngularFirestore) { }

  getAll() {
    return this.db.list("agendamentos").snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
  }

  pegarTodos(key) {
    // const size$ = new Subject<string>();
    // return size$.pipe(
    //   switchMap(size =>
    //     this.db.list('agendamentos', ref => ref.orderByChild('idBarbearia').equalTo(size)).snapshotChanges()
    //   )
    // )
    return this.db.list('agendamentos', ref => ref.orderByChild('idBarbearia').equalTo(key)).snapshotChanges()
    .pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    )
  }

  finalizar(key){
    this.db.object('agendamentos/'+key).update({status: true})
  }
}
