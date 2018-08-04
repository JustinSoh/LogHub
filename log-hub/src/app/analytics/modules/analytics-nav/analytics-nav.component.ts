import { Component, OnInit } from '@angular/core';
import { WebapiService } from '../../../services/webapi.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-nav',
  templateUrl: './analytics-nav.component.html',
  styleUrls: ['./analytics-nav.component.css']
})
export class AnalyticsNavComponent implements OnInit {

  private webApi:WebapiService;
  private as:AnalyticsService
  constructor(webapi:WebapiService , as:AnalyticsService) {
    this.webApi = webapi;
    this.as = as;
   }

  ngOnInit() {
    this.as.currentDetails.subscribe(data => {
      console.log(data + "testing oligx cjs");
    })
  }

  public showCompareOutlet = false;
  public showTestingOutlet = false;
  public Chart = "Chart";
  public Compare = "Compare with";
  public chartBoolean = false; 
  public compareBoolean = false;
  private showRouterOutlet(data){
    this.showCompareOutlet = true;
    this.Compare = data;
    console.log(this.showCompareOutlet)
    
  }
  private clearRouterOutlet(data){
    
    this.showCompareOutlet = false;
    this.Compare = data;
    console.log(this.showCompareOutlet)
  }
  
  private activateChart(data)
  {
    this.Chart = data;
  }
}
