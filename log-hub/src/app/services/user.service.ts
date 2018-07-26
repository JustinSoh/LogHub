import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>

  constructor(public afs: AngularFirestore) {
    this.userCollection = this.afs.collection('User');
    this.users = this.userCollection.valueChanges();
  }

  getUsers() {
    return this.users;
  }
}

