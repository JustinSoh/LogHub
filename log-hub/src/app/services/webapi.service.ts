import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { User } from '../class/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {
  
  private currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  public user:Observable<User> = this.currentUser.asObservable();

  private currentUserID: BehaviorSubject<String> = new BehaviorSubject(null);
  public userID:Observable<String> = this.currentUserID.asObservable();

  currentUserMethod(user:User)   {
      this.currentUser.next(user);
  }

  currentUserIDMethod(userID:String)
  {
    this.currentUserID.next(userID);
  }


  private http:HttpClient;
  constructor(http: HttpClient) { 
    this.http = http;

  }

  async getUser(userId)
  {
    var data =  await this.http.get("https://loghub.azurewebsites.net/api/Users/" + userId).toPromise();
    var listOfUser = new Array<User>();
    var user;
    if(data != null)
    {
       user = this.convertUser(data)
    }
    return user;

  }

  async getAllUsers()
  {
    var data =  await this.http.get("https://loghub.azurewebsites.net/api/Users").toPromise();
    var listOfUser = new Array<User>();
    if(data != null)
    {
      for(var i = 0; i < data['length']; i++)
      {
        listOfUser.push(this.convertUser(data[i]));
      }
      
    }
    return listOfUser
  }

  async updateUser(userId:string, user:User)
  {
      var data = await this.http.put("https://loghub.azurewebsites.net/api/Users/" + userId , user).toPromise();
      console.log(data);
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
