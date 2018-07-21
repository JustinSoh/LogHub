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
import { TemplateComponent } from './template/template.component';
import { AnalyticsMainComponent } from './analytics/analytics-main/analytics-main.component';
import { MainComponent } from './main/main.component';
import { OverviewChartComponent } from './analytics/modules/overview-chart/overview-chart.component';
import { CpuChartComponent } from './analytics/modules/cpu-chart/cpu-chart.component';
import { AnalyticsNavComponent } from './analytics/modules/analytics-nav/analytics-nav.component';

const routes: Routes = [
  {path: "" , redirectTo: "login" , pathMatch:"full"},
  { path: "login",component: LoginComponent , children: [
    {path: "" , component: LoginDetailsComponent, outlet: 'loginPath'},
    { path: "loginDetails", component: LoginDetailsComponent , outlet: 'loginPath'},
    { path: "register",component: RegistrationDetailsComponent ,  outlet: 'loginPath' },
    { path: "changeDetails", component: ChangeDetailsComponent , outlet: 'loginPath'},
    { path: "confirmation", component: EmailConfirmationComponent , outlet: 'loginPath' },
    { path: "forgotPassword",component: ForgetPasswordComponent , outlet: 'loginPath'},
  ] },
  { path: "home", component: MainComponent},
  { path: "home/analytics" , component: AnalyticsNavComponent }
  
  // { path: "home", component: MainComponent , children: [
  //   {path: "", component: AnalyticsMainComponent , outlet: 'mainPath'} //Change this to the main page next time
  // ]},

];


@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})

export class AppRoutingModule {}

