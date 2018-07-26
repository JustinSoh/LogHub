import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { LoginDetailsComponent } from '../login-details/login-details.component';
import { UserService } from '../../services/user.service';
import { User } from '../../class/user';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../class/organization';

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.css']
})
export class RegistrationDetailsComponent implements OnInit {

  constructor(userService:UserService, organizationService:OrganizationService) { 
    this.userService = userService;
    this.organizationService = organizationService;
  }
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  organizationName = new FormControl('' , [Validators.required]);
  pin = new FormControl('' , [Validators.required]);
  pinH = ""
  passwordhash = ""
  organizationNames = Array<Organization>();
  allUser = Array<User>();
  private userService:UserService
  private organizationService:OrganizationService;
  error = false;
  public SHA512;
  errorMessage = ""
  
  ngOnInit() {
    var allUsers = this.userService.getUsers().subscribe(data => {
      data.forEach(user => {
        var newUser = this.userService.convertUser(user);
        this.allUser.push(newUser)
      }
    )});
    this.organizationService.getOrgs().subscribe(data => {
      data.forEach(org => {
        var newOrg = this.organizationService.convertOrg(org); 
        this.organizationNames.push(newOrg)
      });
    })
    this.SHA512 = require("crypto-js/sha256");
  }

  // validateUser()
  // {
  //   var allUsers = this.userService.getUsers().subscribe(data => {
  //       data.forEach(user => {
  //         var newUser = this.userService.convertUser(user);
  //         if(this.username.value == newUser.$userId)
  //         {
  //           this.error = true;
  //           this.errorMessage =  "Username is in use"
  //         }
  //         else {
  //           this.error = true;
  //           this.errorMessage = ""
  //         }
  //     })
  //   })
  // }

  public passwordHash(passwd)
  {
    this.passwordhash = this.SHA512(passwd).toString();
  }

  public pinHash(passwd)
  {
    this.pinH = this.SHA512(passwd).toString();
  }


  logIn()
  {
    this.allUser.forEach(user => {
        if(this.username.value == user.$userId)
        {
          this.error = true;
          this.errorMessage =  "Username is in use"
         
        }
        else {
          this.error = false;
          this.errorMessage = ""
        }
     });

     var correctpin = ""
     if(this.organizationName.valid)
     {
       this.organizationNames.forEach(org => {
         if(this.organizationName.value == org.$organizationId)
         {
            var correctPin = org.$securePinCode
            if(this.pin.valid)
            {
              if(this.pinH == correctPin)
              {
                this.error = false;
                this.errorMessage = ""
              }
              else {
                this.error = true;
                this.errorMessage = "Invalid Pin"
              }
            }
         }
       })
     }
     console.log(this.pinH)
     console.log(this.organizationName.value)
     
  }
}

