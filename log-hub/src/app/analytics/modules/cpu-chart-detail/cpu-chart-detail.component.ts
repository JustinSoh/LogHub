import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/services/analytics.service';
import { CpuClass } from 'src/app/class/cpu-class';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { HostClass } from 'src/app/class/host-class';
import * as Chart from 'chart.js'
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
  public chart: any;
  public dataset; 
  public mapping:Map<number, string>;
  constructor(private as: AnalyticsService) {
    this.analyticsService = as;
  }



  public ngOnInit() {
    this.analyticsService.currentData.subscribe(data => {
      this.currentData = data;
      // this.updateChart(this.currentData);
      if (this.chart != null) {
        this.updateChart(this.currentData);
      }
      else {
        this.createChart(this.currentData);
      }
    });

  

  }

  createChart(currentData: CpuClass) {
    //Convert the current data into cpu class 
    var convertedData = this.convertData(currentData.$hosts);
    var hostList = new Array<string>();
    //Get all the unique host for x label 
    var dataSet: Array<any> = this.getUniqueHost(convertedData[0]);
    //converts the hostname into a map value and get an array of x and y
    var fullList = this.mapHost(dataSet, convertedData[0]);
    //create an array of all the key for xlabel
    this.dataset = fullList[0];
    var title = this.getTitleOfChart(currentData.$y);
    var risk = this.getRiskOfChart(currentData.$x);

    this.chart = new Chart("canvas", {
      type: "scatter",
      data: {
        datasets: this.updateDataset(fullList[0])
      },
      options: this.changeChartOptions(title, risk, fullList),
    })

    
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
    this.dataset = fullList[0];
    

    //Set barchartoptions 
    var title = this.getTitleOfChart(currentData.$y);
    var risk = this.getRiskOfChart(currentData.$x);
    this.chart.data.datasets = this.updateDataset(fullList[0]);
    this.chart.options = this.changeChartOptions(title, risk, fullList);
    this.chart.update();






    // this.barChartData= [
    //   {data: ['0.2','0.8'], label: 'Hosts'},
    // ];
  }

  updateDataset(fullList) {
    return [{
      label: "Hosts",
      data: fullList,
      borderColor: '#0072FF',
      pointBackgroundColor: '#0072FF',
      pointBorderColor: '#0072FF',
      backgroundColor: '#0072FF',
      pointRadius: 15,
      pointHoverRadius: 15
    },];
  }

  changeChartOptions(title: String, risk: String, fullList) {
    console.log(title);
    var options = {
      responsive: true,
      maintainAspectRatio: true,
      ticks: {
        autoSkip: false
      },
      scaleShowValues: true,
      title: {
        display: true,
        text: "Hosts whose " + title + " usage is at " + risk + " risk",
        fontSize: 18,
        fontWeight: 'Bold',
        fontColor: 'black',
        padding: 40,
        position: 'top',
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display:true,
            labelString: "Hostname",
          },
          ticks: {
            callback: function (value, index, values) {
              console.log(title)
              for (let entry of Array.from(fullList[1].entries())) {
                if (value == entry[0]) {
                  return entry[1];
                }
              }
            },
            min: 1,
            stepSize: 1,
            fontSize: 12,
            fontStyle: "bold",
            fontColor: 'black',
            padding: 30,
            autoSkip: false,
            
            
          },
         
        }],
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 0.1,
            fontSize: 12,
            fontStyle: "bold",
            fontColor: 'black',
            padding: 30,
            autoSkip: false,
            max: 1,
            
          },
          scaleLabel: {
            display:true,
            labelString: "Intensity within " + risk + " level",
          },
        }]
      },
      tooltips: {
        fontSize: 20,
        callbacks: {
          label: function (tooltipItem, chartData) {
            var hostValue = tooltipItem.xLabel;
            for (let entry of Array.from(fullList[1].entries())) {
              if (hostValue == entry[0]) {
                hostValue = entry[1];
              }
            }

            var riskLevel = tooltipItem.yLabel;
            return "The host " + hostValue + " has a risk level of " + riskLevel + " when it comes to " + title + " usage";
          }
        }
      },
     
    }
    console.log(title);
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
      return "Low";
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
    this.mapping = mapping;
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
    return [finalArray, mapping];

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
  public chartClicked(e: any, content): void {
   this.dataset.forEach(data => {
     var index = this.chart.getElementAtEvent(e)[0]._index;
     var index = index + 1; 
     if(index == data.x)
     {
       var key = data.x;
       var value;
       for (let entry of Array.from(this.mapping.entries())) {
        if(key == entry[0])
        {
          value = entry[1];
        }
       };

       this.currentData.$hosts.forEach(data => {
         if(data.$hostId == value)
         {
           console.log(data);
         }
       })
       
     }
   })
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
      pointRadius: 15,
      pointHoverRadius: 15
    },]

}


