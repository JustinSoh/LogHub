import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {

  private http:HttpClient;
  constructor(http: HttpClient) { 
    this.http = http;

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

  convertUser(data)
  {
    var userId = data['userId']
    var password = data['password']
    var email = data['email']
    var organizationId = data['organizationId']
    var bandwidthSetting = data['bandwidthSetting'].split(",")
    var user = new User(userId, password , email , organizationId , bandwidthSetting);
    return user;
  }
}
