import { Component, OnInit } from '@angular/core';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-analytics-nav',
  templateUrl: './analytics-nav.component.html',
  styleUrls: ['./analytics-nav.component.css']
})
export class AnalyticsNavComponent implements OnInit {

  private webApi:WebapiService;
  constructor(webapi:WebapiService) {
    this.webApi = webapi;
   }

  ngOnInit() {
    
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
