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

  getSpecificThreshold(userID , targetHostName)
  {
    return this.afs.collection('Threshold', ref => ref.where('UserID', "==" , userID).where('TargetHostName', "==" , targetHostName))
  }

  getSpecificThresholdBasedOnOrganizationAndUserID(userID , organizationId)
  {
    return this.afs.collection('Threshold', ref => ref.where('UserID', "==" , userID).where('organizationId', "==" , organizationId))
  }


  getThresholdLevel(userID , targetHostName ,  organizationId , thresholdLevel , warningMessage)
  {
    return this.afs.collection('Threshold' ).valueChanges()
  }

  getThresholdID()
  {
    return this.afs.collection('Threshold' ).snapshotChanges();
  }
  setThresholdLevel(userID , targetHostName ,  organizationId , thresholdLevel , warningMessage  , thresholdLevelEnd)
  {
    // try  {
    //   var test = this.afs.collection('Threshold' , ref => ref.where('userID' , '==' , "testing"))

    // }
    
    this.afs.collection('Threshold').add({
        'UserID':userID, 
        'TargetHostName':targetHostName, 
        'organizationId': organizationId, 
        'thresholdLevel':thresholdLevel, 
        'warningMessage':warningMessage,
        'thresholdLevelEnd':thresholdLevelEnd
    })
    
  
  }

  updateThresholdLevel(docID , userID , targetHostName ,  organizationId , thresholdLevel , warningMessage , thresholdLevelEnd )
  {
    // try  {
    //   var test = this.afs.collection('Threshold' , ref => ref.where('userID' , '==' , "testing"))

    // }
    
    this.afs.collection('Threshold').doc(docID).update({
        'UserID':userID, 
        'TargetHostName':targetHostName, 
        'organizationId': organizationId, 
        'thresholdLevel':thresholdLevel, 
        'warningMessage':warningMessage,
        'thresholdLevelEnd':thresholdLevelEnd

    })
    
  
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
