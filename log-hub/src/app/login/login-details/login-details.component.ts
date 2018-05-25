import { Component, OnInit } from '@angular/core';
import { md5 }  from 'node_modules/md5';
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.css']
})
export class LoginDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
  public usernameEmpty = true;
  public passwordEmpty = false;
  public username = ""
  private hashedpw = ""
  public forgetBoolean


  logIn()
  {
    if(this.username == "" || this.username == null || this.hashedpw == null || this.hashedpw == "")
    {
      console.log("Fields are not filled")
    }
    else {
      console.log(this.username);
      console.log(this.hashedpw);
    }
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
