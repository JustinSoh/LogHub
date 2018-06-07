import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ChartModule } from 'angular2-chartjs';
import { LoginComponent } from './login/login.component';
import { TemplateComponent } from './template/template.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { FilteredGraphsComponent } from './filtered-graphs/filtered-graphs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginDetailsComponent } from './login/login-details/login-details.component';
import { RegistrationDetailsComponent } from './login/registration-details/registration-details.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { EmailConfirmationComponent } from './login/email-confirmation/email-confirmation.component';
import { ChangeDetailsComponent } from './login/change-details/change-details.component';
import { AnalyticsMainComponent } from './analytics/analytics-main/analytics-main.component';
import { MainComponent } from './main/main.component';
import { AnalyticsNavComponent } from './analytics/modules/analytics-nav/analytics-nav.component';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { CpuChartComponent } from './analytics/modules/cpu-chart/cpu-chart.component';
import { OverviewChartComponent } from './analytics/modules/overview-chart/overview-chart.component';
import { ChartsModule } from 'node_modules/ng2-charts';
import { CPUChartOverview } from './analytics/modules/cpu-chart-overview/cpu-chart-overview.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TemplateComponent,
    LoginDetailsComponent,
    RegistrationDetailsComponent,
    FilteredGraphsComponent,
    ForgetPasswordComponent,
    EmailConfirmationComponent,
    ChangeDetailsComponent,
    AnalyticsMainComponent,
    MainComponent,
    AnalyticsNavComponent,
    CpuChartComponent,
    OverviewChartComponent,
    CPUChartOverview
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    ChartModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    MatMenuModule,
    ChartsModule
  ],
  providers: [AppRoutingModule],
  bootstrap: [AppComponent],

})
export class AppModule {
}



