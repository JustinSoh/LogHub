import { Component, OnInit} from '@angular/core';
import { WebapiService } from './services/webapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebapiService]
})
export class AppComponent {
  title = 'app';
  type = 'line';
  data = [1,2,3]
  
  
}


