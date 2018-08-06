import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CpuLogs } from '../class/cpu-logs';

@Injectable({
  providedIn: 'root'
})

export class CpuLogsService {

  itemsCollection: AngularFirestoreCollection<CpuLogs>;
  itemsCollection2: AngularFirestoreCollection<CpuLogs>;
  items: Observable<CpuLogs[]>;
  items2: Observable<CpuLogs[]>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection('CPU Logs', ref => {
      return ref.orderBy('time', 'asc')
    });
    this.items = this.itemsCollection.valueChanges()
  }

  getItems2(hostname) {
    this.itemsCollection2 = this.afs.collection('CPU Logs', ref => {
      return ref.where('hostname', '==', hostname).orderBy('time', 'asc')
    });
    this.items2 = this.itemsCollection2.valueChanges()
    return this.items2
  }

  getItems() {
    return this.items;
  }
}

