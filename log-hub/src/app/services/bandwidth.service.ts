import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Bandwidth } from '../class/bandwidth';

@Injectable({
  providedIn: 'root'
})
export class BandwidthService {

  bandwidthCollection: AngularFirestoreCollection<Bandwidth>;
  bandwidth: Observable<Bandwidth[]>

  constructor(public afs: AngularFirestore) {
    this.bandwidthCollection = this.afs.collection('Bandwidth');
    this.bandwidth = this.bandwidthCollection.valueChanges();
  }

  getBandwidth() {
    return this.bandwidth;
  }
}
