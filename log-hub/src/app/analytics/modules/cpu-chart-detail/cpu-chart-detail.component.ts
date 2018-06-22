import { Component, OnInit , Input } from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/services/analytics.service';
import { CpuClass } from 'src/app/class/cpu-class';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { HostClass } from 'src/app/class/host-class';

@Component({
  selector: 'app-cpu-chart-detail',
  templateUrl: './cpu-chart-detail.component.html',
  styleUrls: ['./cpu-chart-detail.component.css']
})
export class CpuChartDetailComponent implements OnInit{

  currentData:CpuClass;
  private analyticsService:AnalyticsService;
  private testing = "testing";
  public barChartData:any[];
  constructor(private as:AnalyticsService) { 
    this.analyticsService = as;
  }



  ngOnInit() {
    this.analyticsService.currentData.subscribe(data=>
      {
        this.currentData = data;
        this.updateChart(this.currentData);
      } );
    
  }

  updateChart(currentData:CpuClass)
  {
    var convertedData = this.convertData(currentData.$hosts);
    var hostList = new Array<string>();
    var dataSet = convertedData[0];
    convertedData[0].forEach(e => {
      console.log(e[0]);
    });
    this.barChartData= [
      {data: [{x:'0.2',y:'0.8'}], label: 'Hosts'},
    ];
    
    // this.barChartData= [
    //   {data: ['0.2','0.8'], label: 'Hosts'},
    // ];
  }

  convertData(hostList:Array<HostClass>)
  {
    var dataList = new Array();
    var dataSet = new Array<HostClass>();
    hostList.forEach(e => {
      var riskLevel = e.$cpuRiskLevel;
      var hostName = e.$hostId;
      dataList.push([hostName , riskLevel]);
    })
    return [dataList, dataSet];
  }
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'scatter';
  public barChartLegend:boolean = true;
 
 
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }


}
