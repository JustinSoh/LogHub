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

  formatUsers(allUserUn) {
    var allUser = Array<User>();
    this.users.forEach(element => {
      allUser.push(this.convertUser(element))
    });
    return allUser
  }

  addUser(user)
  {
    
    this.userCollection.add(user)
  }
  convertUser(data)
  {
    var userId = data['userId']
    var password = data['password']
    var email = data['email']
    var organizationId = data['organizationId']
    var bandwidthSetting = data['bandwidthSetting']
    var user = new User(userId, password , email , organizationId , bandwidthSetting);
    return user;
  }
}

