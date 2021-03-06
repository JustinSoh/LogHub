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
import { CpuChartDetailComponent } from './analytics/modules/cpu-chart-detail/cpu-chart-detail.component';
import { CpuChartHostComponent } from './analytics/modules/cpu-chart-host/cpu-chart-host.component';
import { BandwidthComponent } from './analytics/bandwidth/bandwidth.component';
import { MatCardModule } from '@angular/material/card';
import { ViewEncapsulation } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { WebapiService } from './services/webapi.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2'
import {MatIconModule} from '@angular/material/icon';

export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { UserService } from './services/user.service';
import { OrganizationService } from './services/organization.service';
import { BandwidthService } from './services/bandwidth.service';
import { DetailsTemplateComponent } from './analytics/detailsTemplate/details-template/details-template.component';
import { BandwidthDetailsComponent } from './analytics/bandwidth-details/bandwidth-details.component';
import { HostDetailsComponent } from './analytics/host-details/host-details.component';

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
    CPUChartOverview,
    CpuChartDetailComponent,
    CpuChartHostComponent,
    BandwidthComponent,
    DetailsTemplateComponent,
    BandwidthDetailsComponent,
    HostDetailsComponent,
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
    ChartsModule,
    MatCardModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    MatIconModule
  ],
  providers: [AppRoutingModule, UserService, OrganizationService, BandwidthService],
  bootstrap: [AppComponent],

})
export class AppModule {
}



