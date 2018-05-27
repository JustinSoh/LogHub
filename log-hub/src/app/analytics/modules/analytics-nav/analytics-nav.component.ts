import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics-nav',
  templateUrl: './analytics-nav.component.html',
  styleUrls: ['./analytics-nav.component.css']
})
export class AnalyticsNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public showCompareOutlet = false;

  private showRouterOutlet(){
    this.showCompareOutlet = true;
  }
  private clearRouterOutlet(){
    this.showCompareOutlet = false;
  }
}
