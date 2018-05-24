import { Component, OnInit } from '@angular/core';
import { passwordHash }  from 'password-hash';
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
  logIn()
  {
    console.log(this.username);
  }
  passwordHash(passwd)
  {
    this.hashpw(passwd);
  }

  hashpw(passwd):string
  {

    return "he"
  }
}
