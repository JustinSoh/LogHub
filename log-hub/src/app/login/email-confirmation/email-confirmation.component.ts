import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {

  confirmation = new FormControl('', [Validators.required]);
  confirmation1 = ""

  validated = false;
  constructor() { }

  ngOnInit() {
  }

  validate(value)
  {
    if(this.confirmation.valid)
    {
      //send to backend 
      if(this.confirmation.value == "1234")
      {
        this.validated= true;
      }
      else {
        this.validated = false;
      }
    }
    else {
      this.validated = false;
      
    }
  }
}