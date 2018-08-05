import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Bandwidth } from '../class/bandwidth';
import Timestamp = firestore.Timestamp;
import { firestore } from '../../../node_modules/firebase';
import { HostMapping } from '../class/host-mapping';
@Injectable({
  providedIn: 'root'
})
export class HostmappingService {
  hostMappingCollection: AngularFirestoreCollection<HostMapping>;
  hostMapping2: Observable<HostMapping[]>

  constructor(public afs: AngularFirestore) {
    this.hostMappingCollection = this.afs.collection('HostMapping');
    this.hostMapping2 = this.hostMappingCollection.valueChanges();

  }

  getHostMapping()
  {
    return this.hostMapping2;
  }

  getSpecificHostBasedOnID(id)
  {
    return this.afs.collection('HostMapping' , ref => ref.where('Hostname', '==', id)).valueChanges();
  }

  convertToHostMapObj(data)
  {
    var DefaultGateway = data['DefaultGateway'];
    var Hostname = data['Hostname'];
    var IPAddress = data['IPAddress']
    var MACAddress = data['MACAddress']
    var OrganizationId = data['OrganizationId']
    var newHM:HostMapping = new HostMapping(DefaultGateway , Hostname , IPAddress , MACAddress , OrganizationId);
    return newHM;
  }

}
