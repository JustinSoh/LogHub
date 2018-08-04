import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Bandwidth } from '../class/bandwidth';
import Timestamp = firestore.Timestamp;
import { firestore } from '../../../node_modules/firebase';
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
  
  getBandwidthBasedOnId(organizationId){
    var data = this.afs.collection('Bandwidth')
    return data;
  }

  convertBandwidth(bw)
  {

    var bandwidthId = bw['bandwidthId'];
    var hostId = bw['hostId'];
    var included = bw['included']
    var organizationId = bw['organizationId']
    var riskScore = bw['riskScore']
    var usage = bw['usage']
    var time:Timestamp = bw['time']
    var processed = bw['processed']
    var newbw:Bandwidth = new Bandwidth(bandwidthId , hostId , included , organizationId , riskScore , time.toDate(), usage , processed)
    return newbw;
  }

  
}
