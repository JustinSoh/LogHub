import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Organization } from '../class/organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  orgCollection: AngularFirestoreCollection<Organization>;
  orgs: Observable<Organization[]>

  constructor(public afs: AngularFirestore) {
    this.orgCollection = this.afs.collection('Organization');
    this.orgs = this.orgCollection.valueChanges();
  }

  getOrgs() {
    return this.orgs;
  }

  convertOrg(data)
  {
    var organizationId = data['organizationID']
    var organizationName = data['organizationName']
    var pin = data['securePinCode']
  
    var user = new Organization(organizationId , organizationName , pin);
    return user
  }
}
