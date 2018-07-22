import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    var data =  this.http.get("https://loghub.azurewebsites.net/api/Users").toPromise();
    console.log(data);
  }
}
