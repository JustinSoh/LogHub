import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cpu-chart',
  templateUrl: './cpu-chart.component.html',
  styleUrls: ['./cpu-chart.component.css']
})
export class CpuChartComponent implements OnInit {

  constructor() { }
  private predictionArray = [3,4,3,4,5,3,5,4,2,3,4,5,3,2,2,1,1,2,3,4,5,3,2,5,3,4,3,2,1,2];
  private actualArray = [2,3,4,5,6,4,3,3,2,1,5,4,3,6,7,8,9,4,2,1,2,4,5,3,1,3,5,8,6,3];
  private labelArray = ['a','b','c','d','e','f','g','h','i','j','aa','bb','cc','dd','ee','ff','gg','hh','ii','jj','aaa','bbb','ccc','ddd','eee','fff','ggg','hhh','iii','jjj']
  private splicePredictionArray; 
  private spliceActualArray;
  private spliceLabelArray;
  private arrays = []
  private actualData = [];
  private predictData = [];
  private labelData = [];
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any> ;
  private counter = 0;
  ngOnInit() {
   
    this.splicePredictionArray = this.splicingMethod(this.predictionArray, 10);
    this.spliceActualArray = this.splicingMethod(this.actualArray, 10);
    this.spliceLabelArray = this.splicingMethod(this.labelArray, 10);
    this.actualData = this.splicePredictionArray[0];
    this.predictData = this.spliceActualArray[0];
    this.labelData = this.spliceLabelArray[0];
    console.log(this.actualData);
    this.UpdateChart(this.actualData, this.predictData, this.labelData);



    
  }

  public setFrequency()
  {

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
    
  // public lineChartData:Array<any> = [
  //   // {data: [this.predictData.get(0, label: 'Prediction'},
  //   {data: this.actualData[0], label: 'Actual'},
  // ];
  
  public lineChartOptions:any = {
    responsive: true,
    maintainAspectRatio: true, 
    ticks: {
      autoSkip: false
    }, 
    
  };
  
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
      this.UpdateChart(this.actualData, this.predictData, this.labelData);
   
      
    }
    else{
      console.log("end");
    }
    // let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    // for (let i = 0; i < this.lineChartData.length; i++) {
    //   _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
    //   for (let j = 0; j < this.lineChartData[i].data.length; j++) {
    //     _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
    //   }
    // }
    // this.lineChartData = _lineChartData;
  }

  public previousSet():void {
    console.log(this.spliceActualArray.length);
    if(this.counter > 0 ){
      this.counter--;
      this.actualData = this.spliceActualArray[this.counter];
      this.predictData = this.splicePredictionArray[this.counter];
      this.labelData = this.spliceLabelArray[this.counter];
      this.UpdateChart(this.actualData, this.predictData, this.labelData);
   
      
    }
    else{
      console.log("end");
    }
    // let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    // for (let i = 0; i < this.lineChartData.length; i++) {
    //   _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
    //   for (let j = 0; j < this.lineChartData[i].data.length; j++) {
    //     _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
    //   }
    // }
    // this.lineChartData = _lineChartData;
  }

  private UpdateChart(actualData, predictData, labelData)
  {
    this.lineChartData = [
      {data: predictData, label: 'Prediction' , fill:false, borderWidth: 4},
      {data: actualData, label: 'Actual', fill:false, borderWidth: 4},
    ];

    this.lineChartLabels = labelData;
  }

 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  

}
