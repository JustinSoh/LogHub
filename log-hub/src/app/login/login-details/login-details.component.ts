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
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  private hashedpw = "";
  public forgetBoolean;
  public validatedBoolean;

  
  
  public hashpw(passwd):string
  {
    var md5 = md5.require('md5');
    this.hashedpw = md5(passwd);
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
