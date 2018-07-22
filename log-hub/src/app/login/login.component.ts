import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  constructor() {  }
  
  showLogin = false;
  showRegistration = false;
  loginBoolean = false;
  registerBoolean = false;

  ngOnInit() {
    this.loginBoolean = true;
    this.showLogin = true;
    
  }

  loginActivated()
  {
    this.showLogin = true;
    this.loginBoolean = true;
    this.registerBoolean = false;
    this.showRegistration = false;

  }

  registrationActivated() {
    this.showLogin = false;
    this.showRegistration = true;
    this.registerBoolean = true; 
    this.loginBoolean = false;
  }
}
