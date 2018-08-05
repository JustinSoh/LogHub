import { Injectable } from '@angular/core'; 
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore'; 
import { Observable } from 'rxjs'; 
import { CpuDetails } from '../class/cpu-details'; 
 
@Injectable({ 
  providedIn: 'root' 
}) 
 
export class CpuDetailsService { 
 
  itemsCollection: AngularFirestoreCollection<CpuDetails>; 
  items: Observable<CpuDetails[]> 
 
  constructor(private afs: AngularFirestore) { 
    this.itemsCollection = this.afs.collection('Endpoint-Client', ref => { 
      return ref.where('orgId', '==', 'testing') 
    }); 
    this.items = this.itemsCollection.valueChanges() 
  } 
 
  getItem() { 
    return this.items; 
  } 
} 
 
