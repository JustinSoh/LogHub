import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ChartModule } from 'angular2-chartjs';
import { LoginComponent } from './login/login.component';
import { TemplateComponent } from './template/template.component';
import { MatButtonModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { FilteredGraphsComponent } from './filtered-graphs/filtered-graphs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TemplateComponent,
    FilteredGraphsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    ChartModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}



