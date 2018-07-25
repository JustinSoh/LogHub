import { Component, OnInit } from '@angular/core';
import { WebapiService } from '../services/webapi.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private webApi:WebapiService
  constructor(webApi:WebapiService) {
    this.webApi = webApi
   }

  ngOnInit() {
   
  }

}
