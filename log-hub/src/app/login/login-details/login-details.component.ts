import { Component, OnInit } from '@angular/core';
import { hasha }  from 'node_modules/crypto-js'
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { WebapiService } from '../../services/webapi.service';
import { UserService } from '../../services/user.service';
import { User } from '../../class/user';
@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.css'],
})
export class LoginDetailsComponent implements OnInit {

  private router:Router;
  private webApi:WebapiService 
  private userService:UserService;
  private allUser:Array<User> = new Array<User>();
  constructor(router:Router , webapi:WebapiService , userService:UserService) { 
    this.router = router;
    this.webApi = webapi;
    this.userService = userService;
  }
  public SHA512;
  ngOnInit() {
    this.SHA512 = require("crypto-js/sha256");
    this.userService.getUsers().subscribe(data => {
      for(var i = 0; i < data.length; i++)
      {
        var newUser = this.userService.convertUser(data[i]);
        this.allUser.push(newUser)
      }
    });
    this.userService.getUserDocumentID().subscribe(data => {
      for(var i = 0 ; i < data.length; i++)
      {
        this.allUser[i].$documentID = data[i].payload.doc.id;
      }
    });

  }
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  private hashedpw = "";
  public forgetBoolean;
  public validatedBoolean = true;
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
      //this.finalValidation()

    }
  }

  async logIn()
  {
    this.allUser.forEach(usr => {
      if(usr.$userId == this.username.value && usr.$password == this.hashedpw)
      {
        this.validatedBoolean = true;
            this.webApi.currentUserMethod(usr);
            this.router.navigate(['/', 'home']);
      }
      else {
        this.validatedBoolean = false;
      }
    })
    // listOfUser.forEach(element => {
    //   if(this.username.value == element.$userId && this.hashedpw == element.$password)
    //   {
    //     this.validatedBoolean = true;
    //     this.webApi.currentUserMethod(element);
    //     this.router.navigate(['/', 'home']);
    //   }
    //   else {
    //     this.validatedBoolean = false;
    //   }
    // });
    //
  }

  public passwordHash(passwd)
  {
    this.hashpw(passwd);
    if(this.password.valid)
    {
      this.passwordB = true;
      //this.finalValidation();
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
