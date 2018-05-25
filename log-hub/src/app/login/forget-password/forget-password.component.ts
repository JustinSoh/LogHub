import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  link = "invalid"
  constructor() { }

  ngOnInit() {
  }
  emailBoolean:Boolean = false;
  // getErrorMessage() {
  //   if (this.emailBoolean == true) {
  //     return this.email.hasError('required') ? 'You must enter a value' :
  //     this.email.hasError('email') ? 'Not a valid email' :
  //         '';
  //   }
  //   else {
  //     return; 
  //   }
    
  // }

 
}
