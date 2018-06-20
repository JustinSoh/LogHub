import { Component, OnInit } from '@angular/core';
import { Gchart } from 'src/app/class/gchart';
import { AnalyticsService } from '../../services/analytics.service';
import { CpuClass } from '../../../class/cpu-class';

@Component({
  selector: 'app-cpu-chart',
  templateUrl: './cpu-chart.component.html',
  styleUrls: ['./cpu-chart.component.css']
})
export class CpuChartComponent implements OnInit {
  
  

  //For overview chart
  private cpuChartOverview:Gchart; 

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
  public showDetails:Boolean = false;


  private analyticsService:AnalyticsService
  constructor(public as:AnalyticsService) { 
    this.analyticsService = as;
  }

  ngOnInit() {
    
    // this.splicePredictionArray = this.splicingMethod(this.predictionArray, 10);
    // this.spliceActualArray = this.splicingMethod(this.actualArray, 10);
    // this.spliceLabelArray = this.splicingMethod(this.labelArray, 10);
    // this.actualData = this.splicePredictionArray[0];
    // this.predictData = this.spliceActualArray[0];
    // this.labelData = this.spliceLabelArray[0];
    // this.UpdateChart(this.actualData, this.predictData, this.labelData);
    
    //method to retrieve data from database 
    var cpuChartOverviewData = this.retrieveDatasetFromDatabase();
    //indicate the type of labels of the chart
    var cpuChartOverviewLabel = ['Low','Medium','High'];
    //indicate what type of chart you would like
    var cpuChartType = "bubble";
    //used to pass data over to the cpu-chart-overview component
    this.cpuChartOverview = new Gchart(cpuChartOverviewData, cpuChartOverviewLabel , cpuChartType);
    //subscribe to an event on the cpu-chart-overview component
    this.analyticsService.currentDetails.subscribe(status => this.showDetails = status);
  }

  public retrieveDatasetFromDatabase()
  {
    //Initializing the Scatterplot data (Get from database)
    //Low = 0.0, Medium = 5.0 , High = 10.0 (X Value)
    //6 = Broser , 5 = Game , 4 = Word Processing , 3 = Database , 2 = Spreadsheet , 1 = Multimedia
   
    var cpuClassLow1 = new CpuClass('0.0' , '1.0' , 20);
    var cpuClassLow2 = new CpuClass('0.0' , '3.0' , 10);
    var cpuClassMedium1 = new CpuClass('5.0' , '2.0', 20);
    var cpuClassMedium2 = new CpuClass('5.0' , '3.0' , 20);
    var cpuClassHigh1 = new CpuClass('10.0' , '4.0', 20);
    var cpuClassHigh2 = new CpuClass('10.0', '6.0' , 40);
    
    var arrayOfAllData = new Array<CpuClass>();
    //Change arrayOfAllData to retrieved data from database
    arrayOfAllData.push(cpuClassLow1 , cpuClassLow2 , cpuClassMedium1 , cpuClassMedium2 , cpuClassHigh1 , cpuClassHigh2);
    var array:any = this.sortData(arrayOfAllData);

    var arrayOfLowSet = array[0]; 
    console.log(arrayOfLowSet);
    var arrayOfMediumSet = array[1];
    var arrayOfHighSet = array[2];

    //use this to trasform data into dataset
    var lowDataSet = this.transformData(arrayOfLowSet);
    var mediumDataSet = this.transformData(arrayOfMediumSet);
    var highDataSet = this.transformData(arrayOfHighSet);


    //Replace the dataset with data retrieved from database in the format of [{x,y,r}, {x,y,r}];
    var cpuChartOverviewData = 
    [{data: lowDataSet,
      label: 'Low' , 
      fill:true,
      },
      {
        data: mediumDataSet,
        label: 'Medium' , 
        fill:true,
      },
      {
        data: highDataSet,
        label: 'High',
        fill:true,
      }
    ] ;

    return cpuChartOverviewData;
  }

  private transformData(dataSet:Array<CpuClass>)
  {
    var array = new Array<any>();
    dataSet.forEach(element => {
      var data = {x:element.$x, y:element.$y , r:element.$r};
      array.push(data);
      console.log(array)
    });

    return array;
  }

  private sortData(dataSet:Array<CpuClass>){
    var lowSet = new Array<CpuClass>();
    var mediumSet = new Array<CpuClass>();
    var highSet = new Array<CpuClass>();
    dataSet.forEach(element => {
      if(element.$x == '5.0')
      {
        mediumSet.push(element);
      }
      if(element.$x == '0.0')
      {
        console.log("does this work");
        lowSet.push(element);
      }
      if(element.$x == '10.0')
      {
        highSet.push(element);
      }
    });

    return [lowSet, mediumSet, highSet];
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

 

}
