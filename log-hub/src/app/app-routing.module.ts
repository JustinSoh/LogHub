// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';

// @NgModule({
//   imports: [ RouterModule ],
//   exports: [ RouterModule ],
// })

// const routes: Routes = [
//   { path: "", component: ForgetPasswordComponent }
// ];

// export class AppRoutingModule { }

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent} from './login/forget-password/forget-password.component'
import { LoginComponent } from './login/login.component';
import { RegistrationDetailsComponent } from './login/registration-details/registration-details.component';
import { LoginDetailsComponent } from './login/login-details/login-details.component';
import { EmailConfirmationComponent } from './login/email-confirmation/email-confirmation.component';
import { ChangeDetailsComponent } from './login/change-details/change-details.component';

const routes: Routes = [
  { path: "changeDetails", component: ChangeDetailsComponent },
  { path: "confirmation", component: EmailConfirmationComponent },
  { path: "forgotPassword", component: ForgetPasswordComponent },
  { path: "login", component: LoginDetailsComponent },
  { path: "register", component: RegistrationDetailsComponent },

  { path: "", component: LoginDetailsComponent }
  
];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})

export class AppRoutingModule {}

