import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics-main',
  templateUrl: './analytics-main.component.html',
  styleUrls: ['./analytics-main.component.css'],
  providers: [AnalyticsService]
})
export class AnalyticsMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
