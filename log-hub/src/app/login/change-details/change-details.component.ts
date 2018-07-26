import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { md5 }  from 'node_modules/md5';
import { LoginDetailsComponent} from '../login-details/login-details.component'
@Component({
  selector: 'app-change-details',
  templateUrl: './change-details.component.html',
  styleUrls: ['./change-details.component.css']
})
export class ChangeDetailsComponent implements OnInit {

  password = new FormControl('', [Validators.required]);
  retype = new FormControl('', [Validators.required]);
  errorMessage = "";
  passwordBoolean = false
  constructor() { }
  hashedCode = new LoginDetailsComponent(null,null);
  ngOnInit() {
  }
  
  changeDetails()
  {
    if(this.password.valid && this.retype.valid)
    {
      var hashpw = this.hashedCode.hashpw(this.password.value);
      var hashre = this.hashedCode.hashpw(this.retype.value);
      
      if(hashpw == hashre)
      {
         this.passwordBoolean = true;  
      }
      else {
        this.passwordBoolean = false;
        this.errorMessage = "Password doesn't match";
      }
    }
    else {
      this.passwordBoolean = false;
      if(this.password.invalid && this.retype.invalid)
      {
        this.errorMessage = "Both field is required"
      }
      else if(this.retype.invalid)
      {
        this.errorMessage = "Retype field is required"
      }
      else if(this.password.invalid){
        this.errorMessage = "Password field is required";
      }
    }
  }}