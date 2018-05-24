import { Component, OnInit } from '@angular/core';
import { md5 }  from 'node_modules/md5';
@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.css']
})
export class LoginDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  public username = ""
  private hashedpw = ""
  public forgetBoolean
  logIn()
  {
    console.log(this.username);
    console.log(this.hashedpw);
  }
  passwordHash(passwd)
  {
    this.hashpw(passwd);
  }

  hashpw(passwd):string
  {
    var md5 = require('md5');
    this.hashedpw = md5(passwd);
    return this.hashedpw;
    
  }

  forgetPassword()
  {
    this.forgetBoolean = true;
  }

}
