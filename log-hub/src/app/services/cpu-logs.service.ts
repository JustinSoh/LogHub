import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CpuLogs } from '../class/cpu-logs';

@Injectable({
  providedIn: 'root'
})

export class CpuLogsService {

  itemsCollection: AngularFirestoreCollection<CpuLogs>;
  items: Observable<CpuLogs[]>;  

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection('CPU Logs', ref => {
      return ref.orderBy('time', 'asc')
    });
    this.items = this.itemsCollection.valueChanges()
  }

  getItems() {
    return this.items;
  }
}

