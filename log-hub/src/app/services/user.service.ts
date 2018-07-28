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
  snapshot: any
  constructor(public afs: AngularFirestore) {
    this.userCollection = this.afs.collection('User');
    this.users = this.userCollection.valueChanges();
    this.snapshot = this.userCollection.snapshotChanges()

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

  getUserDocumentID() { 
    return this.snapshot;
  }

  // getUserByID(docID:string){
   
  //   var allUser:Array<User> = new Array<User>();
  //   this.getUsers().subscribe(data => {
  //     for(var i = 0; i < data.length; i++)
  //     {
  //       var newUser = this.convertUser(data[i]);
  //       allUser.push(newUser)
  //     }
  //   });
  //   var returnValue;
  //   this.getUserDocumentID().subscribe(data => {
  //     for(var i = 0 ; i < data.length; i++)
  //     {
  //       if(data[i].payload.doc.id == docID)
  //       {
  //         returnValue = allUser[i];
  //         returnValue.$documentID = data[i].payload.doc.id
  //         console.log(returnValue)
  //         return returnValue;
          
  //       }
  //       allUser[i].$documentID = data[i].payload.doc.id;
  //     }
  //   });
  
  // }
  convertUser(data)
  {
    var userId = data['userId']
    var password = data['password']
    var email = data['email']
    var organizationId = data['organizationId']
    var bandwidthSetting = data['bandwidthSetting']
    var user = new User(userId, password , organizationId , email , bandwidthSetting);
    return user;
  }
}

