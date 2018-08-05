import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/analytics/services/analytics.service';

@Component({
  selector: 'app-cpu-chart-host',
  templateUrl: './cpu-chart-host.component.html',
  styleUrls: ['./cpu-chart-host.component.css']
})
export class CpuChartHostComponent implements OnInit {

  
  private predictionArray:Array<number>;
  private actualArray:Array<number>
  private labelArray:Array<string>;
  private splicePredictionArray; 
  private spliceActualArray;
  private spliceLabelArray;
  private arrays = []
  private actualData = [];
  private predictData = [];
  private labelData = [];
  private previousClass; 
  private nextClass;
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any> ;
  private counter = 0;
  private analyticsService:AnalyticsService
  private hostname;
  public lineChartOptions:any;
  constructor(as:AnalyticsService) { 
    this.analyticsService = as;
  }

  ngOnInit() {

    // this.analyticsService.currentHostData.subscribe(data => {
    //   //Transform the data into chart readable 
    //   this.hostname = data.$hostId;
    //   this.predictionArray = data.$predictedArray; 
    //   this.actualArray = data.$actualArray; 
    //   this.labelArray = data.$labels;
    //   this.splicePredictionArray = this.splicingMethod(this.predictionArray, 10);
    //   this.spliceActualArray = this.splicingMethod(this.actualArray, 10);
    //   this.spliceLabelArray = this.splicingMethod(this.labelArray, 10);
    //   this.actualData = this.splicePredictionArray[0];
    //   this.predictData = this.spliceActualArray[0];
    //   this.labelData = this.spliceLabelArray[0];
    //   this.UpdateChart(this.actualData, this.predictData, this.labelData, this.hostname);
    // });

   
  }

  private splicingMethod(array, n_length)
  {
    var temp = [];
    if(array.length > 10)
    {
      for(var i = 0; i < array.length; i+=10)
      {
        var myChunk = array.slice(i , i+10);
        temp.push(myChunk);
        
      }
    }
    else {
      temp = array;
    }
   
    return temp; 
  }

  private UpdateChart(actualData, predictData, labelData , hostname)
  {
    this.lineChartData = [
      {data: predictData, label: 'Prediction' , fill:false, borderWidth: 4},
      {data: actualData, label: 'Actual', fill:false, borderWidth: 4},
    ];
    this.lineChartOptions = this.updateOptions(hostname);
    this.lineChartLabels = labelData;
  }

  updateOptions(hostname)
  {
    var options = {
      responsive: true,
      maintainAspectRatio: true, 
      ticks: {
        autoSkip: false
      }, 
      title: {
        display: true,
        text: "CPU baseline for the host: " + hostname,
        fontSize: 18,
        fontWeight: 'Bold',
        fontColor: 'black',
        padding: 40,
        position: 'top',
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "CPU usage",
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Day",
          }
        }]
      }
     
    };
    return options;
  }
  
  
  public lineChartColors:Array<any> = [
    { // grey
      borderColor: '#4EAB7E',
      pointBackgroundColor: '#FAFAFA',
      pointBorderColor: '#4EAB7E',
      pointRadius: 6,
      pointHoverRadius: 6
    },
    { //line 2 
      borderColor: '#00A8FF',
      pointBackgroundColor: '#FAFAFA',
      pointBorderColor: '#00A8FF',
      pointRadius: 6,
      pointHoverRadius: 6
      
    },
    
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';


  
  public nextSet():void {
    console.log(this.spliceActualArray.length);
    if(this.counter < this.spliceActualArray.length-1 ){
      this.counter++;
      this.actualData = this.spliceActualArray[this.counter];
      this.predictData = this.splicePredictionArray[this.counter];
      this.labelData = this.spliceLabelArray[this.counter];
      this.UpdateChart(this.actualData, this.predictData, this.labelData, this.hostname);
   
      
    }
    else{

      console.log("end");
    }
  }

  public previousSet():void {
    console.log(this.spliceActualArray.length);
    if(this.counter > 0 ){
      this.counter--;
      this.actualData = this.spliceActualArray[this.counter];
      this.predictData = this.splicePredictionArray[this.counter];
      this.labelData = this.spliceLabelArray[this.counter];
      this.UpdateChart(this.actualData, this.predictData, this.labelData, this.hostname);
      
    }
    else{
      console.log("end");
    }
  }
}
