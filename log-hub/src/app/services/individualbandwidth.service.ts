import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Bandwidth } from '../class/bandwidth';
import Timestamp = firestore.Timestamp;
import { firestore } from '../../../node_modules/firebase';
import { Indivdualbandwidth } from '../class/indivdualbandwidth';

@Injectable({
  providedIn: 'root'
})
export class IndividualbandwidthService {

  indbandwidthCollection: AngularFirestoreCollection<Bandwidth>;
  indbandwidth: Observable<Bandwidth[]>
  indbandwidthId: Observable<any>
  constructor(public afs: AngularFirestore) { 
    this.indbandwidthCollection = this.afs.collection('IndBW');
    this.indbandwidth = this.indbandwidthCollection.valueChanges();
    this.indbandwidthId = this.indbandwidthCollection.snapshotChanges()

  }

  getBandwidth() {
    return this.indbandwidth;
  }

  getBandwidthID() {
    return this.indbandwidthId;
  }

  getBandwidthIDBasedOnHostname(id)
  {
    return this.afs.collection('IndBW' , ref => ref.where('hostname', '==', id)).snapshotChanges();
  }


  getBandwidthBasedOnHostname(id)
  {
    return this.afs.collection('IndBW' , ref => ref.where('hostname', '==', id)).valueChanges();
  }

 

  convertIndBandwidthFromData(id , data)
  {

    var indBwId = id;
    var hostname = data['hostname'];
    var organizationId = data['organizationId'];
    var time:Timestamp = data['time'];
    var upload = data['upload'];
    var download = data['download'];
   
    var newbw:Indivdualbandwidth = new Indivdualbandwidth(indBwId , hostname, organizationId , time.toDate(), download , upload);
    return newbw;
  }
  
  
}
