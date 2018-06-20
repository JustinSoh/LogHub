import { Component, OnInit } from '@angular/core';
import { hasha }  from 'node_modules/crypto-js'
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.css']
})
export class LoginDetailsComponent implements OnInit {

  constructor() { }
  public SHA512;
  ngOnInit() {
    this.SHA512 = require("crypto-js/sha256");

  }
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  private hashedpw = "";
  public forgetBoolean;
  public validatedBoolean;
  public require:any;
  
  public hashpw(passwd):string
  {
    this.hashedpw = this.SHA512(passwd).toString();
    console.log(this.hashedpw)
    return this.hashedpw;
    
  }

  forgetPassword()
  {
    this.forgetBoolean = true;

  }
   usernameB:Boolean
   passwordB:Boolean
  
  validateUser()
  {
    if(this.username.valid)
    {
      //do some test 
      this.usernameB = true;
      this.finalValidation()
    }
  }

  passwordHash(passwd)
  {
    this.hashpw(passwd);
    if(this.password.valid)
    {
      this.passwordB = true;
      this.finalValidation();
    }
  }

  finalValidation()
  {
    if(this.passwordB && this.usernameB)
    {
      this.validatedBoolean = true;
    }
    else {
      this.validatedBoolean = false;
    }
  }


}
