import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/services/analytics.service';
import { CpuClass } from 'src/app/class/cpu-class';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { HostClass } from 'src/app/class/host-class';

@Component({
  selector: 'app-cpu-chart-detail',
  templateUrl: './cpu-chart-detail.component.html',
  styleUrls: ['./cpu-chart-detail.component.css']
})
export class CpuChartDetailComponent implements OnInit {

  currentData: CpuClass;
  private analyticsService: AnalyticsService;
  private testing = "testing";
  public barChartData: any[];
  public barChartOptions;
  public title: String;
  public risk:String;
  constructor(private as: AnalyticsService) {
    this.analyticsService = as;
  }



  ngOnInit() {
    this.analyticsService.currentData.subscribe(data => {
      this.currentData = data;
      this.updateChart(this.currentData);
    });

  }

  updateChart(currentData: CpuClass) {
    //Convert the current data into cpu class 
    var convertedData = this.convertData(currentData.$hosts);
    var hostList = new Array<string>();
    //Get all the unique host for x label 
    var dataSet: Array<any> = this.getUniqueHost(convertedData[0]);
    //converts the hostname into a map value and get an array of x and y
    var fullList = this.mapHost(dataSet, convertedData[0]);
    //create an array of all the key for xlabel

    this.barChartData = [
      { data: fullList, label: 'Hosts' },
    ];


    //Set barchartoptions 
    this.title = this.getTitleOfChart(currentData.$y);
    this.risk = this.getRiskOfChart(currentData.$x);
    this.barChartOptions = this.changeChartOptions(this.title, this.risk);
    console.log(this.title);
    // this.barChartData= [
    //   {data: ['0.2','0.8'], label: 'Hosts'},
    // ];
  }

  changeChartOptions(title:String, risk:String) {
    var options = {
      responsive: true,
      maintainAspectRatio: true,
      ticks: {
        autoSkip: false
      },
      scaleShowValues: true,
      title: {
        display: true,
        text: "Hosts whose " + title.toLowerCase() + " usage is at " + risk.toLowerCase() + " risk",
        fontSize: 18,
        fontWeight: 'Bold',
        fontColor: 'black',
        padding: 30,
        position: 'top',
      },
    };
    return options;
  }

  getTitleOfChart(yValue) {
    if (yValue == 6) {
      return "Browser";
    }
    if (yValue == 5) {
      return "Game";
    }
    if (yValue == 4) {
      return "Word Processing";
    }
    if (yValue == 3) {
      return "Database";
    }
    if (yValue == 2) {
      return "Spreadsheet";
    }
    if (yValue == 1) {
      return "Multimedia";
    }
  }

  getRiskOfChart(xValue) {
    if (xValue == 0) {
      return  "Low";
    }

    else if (xValue == 5) {
      return "Medium";
    }

    else if (xValue == 10) {
      return "High";
    }
  }

  mapHost(data, dataSet: Array<any>) {
    var integer = 1;
    var mapping: Map<number, string> = new Map<number, string>();
    data.forEach(d => {
      mapping.set(integer, d);
      integer++;
    })

    var xLabel = new Array<number>();
    var finalArray = new Array();
    for (let entry of Array.from(mapping.entries())) {
      xLabel.push(entry[0]);
      for (var i = 0; i < dataSet.length; i++) {
        if (dataSet[i][0] == entry[1]) {
          finalArray.push({ x: entry[0], y: dataSet[i][1] });
        }
      }
    }
    console.log(finalArray);
    return finalArray;

    //Method to retrieve from map 
    //   for (let entry of Array.from(mapping.entries())) {
    //     let key = entry[0];
    //     let value = entry[1];
    //     console.log("The key is " + key + " and the value is " + value)
    // }
  }

  getUniqueHost(data) {
    var allHostsWithDup: Array<String> = new Array<String>();
    //push all hosts in
    data.forEach(element => {
      allHostsWithDup.push(element[0]);
    });

    //create a set with no duplicate
    var hostNoDup = Array.from(new Set(allHostsWithDup));
    return hostNoDup;
  }

  convertData(hostList: Array<HostClass>) {
    var dataList = new Array();
    var dataSet = new Array<HostClass>();
    hostList.forEach(e => {
      var riskLevel = e.$cpuRiskLevel;
      var hostName = e.$hostId;
      dataList.push([hostName, riskLevel]);
    })
    return [dataList, dataSet];
  }



  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: string = 'scatter';
  public barChartLegend: boolean = true;



  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  private lineChartColors: Array<any> = [
    { // grey
      borderColor: '#4EAB7E',
      pointBackgroundColor: '#4EAB7E',
      pointBorderColor: '#4EAB7E',
      backgroundColor: '#4EAB7E',
      pointRadius: 6,
      pointHoverRadius: 6
    },]

}


