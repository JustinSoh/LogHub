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

  getSpecificHostBasedOnID(id:string)
  {
    console.log(id);
    id = id.replace(" ", "");
    id = id.replace("\n", "");
    return this.afs.collection('HostMapping' , ref => ref.where('Hostname', '==', id)).valueChanges();
  }

  convertToHostMapObj(data)
  {
    
    var DefaultGateway = data['DefaultGateway'];
    var Hostname = data['Hostname'];
    var IPAddress = data['IPAdress']
    console.log(data['IPAdress'])
    console.log(IPAddress);
    var MACAddress = data['MACAddress']
    var OrganizationId = data['OrganizationId']
    // DefaultGateway = DefaultGateway.replace(" " , "");
    // DefaultGateway = DefaultGateway.replace("\n" , "");
    // Hostname = Hostname.replace(" " , "")
    // Hostname = Hostname.replace("\n" , "")
    // IPAddress = IPAddress.replace(" " ,"")
    // IPAddress = IPAddress.replace("\n" ,"")
    // MACAddress = MACAddress.replace(" " ,"")
    // MACAddress = MACAddress.replace("\n" ,"")
    // DefaultGateway = DefaultGateway.replace(" " ,"")
    // DefaultGateway = DefaultGateway.replace("\n" ,"")
    // OrganizationId = OrganizationId.replace(" " ,"")
    // OrganizationId = OrganizationId.replace("\n" ,"")
    var newHM:HostMapping = new HostMapping(DefaultGateway , Hostname , IPAddress , MACAddress , OrganizationId);
    return newHM;
  }

}
