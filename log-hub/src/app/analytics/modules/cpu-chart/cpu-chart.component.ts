import { Component, OnInit } from '@angular/core';
import { Gchart } from 'src/app/class/gchart';
import { AnalyticsService } from '../../services/analytics.service';
import { CpuClass } from '../../../class/cpu-class';
import { HostClass } from '../../../class/host-class';
import { element } from 'protractor';
import { CpuChartDetailComponent } from 'src/app/analytics/modules/cpu-chart-detail/cpu-chart-detail.component';

@Component({
  selector: 'app-cpu-chart',
  templateUrl: './cpu-chart.component.html',
  styleUrls: ['./cpu-chart.component.css']
})
export class CpuChartComponent implements OnInit {
  
  

  //For overview chart
  private cpuChartOverview:Gchart; 

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
  public clickedData:CpuClass; 
  public change = "hello";
  public showHost:Boolean = false;
  private analyticsService:AnalyticsService
  constructor(public as:AnalyticsService) { 
    this.analyticsService = as;
  }

  async ngOnInit() {
    
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
    
    await this.analyticsService.currentDetails.subscribe(status => {
      this.showDetails = status;
      if(this.showDetails == true)
      {
        var details = document.getElementById("details");
        if(details != null)
        {
          details.scrollIntoView({behavior: "smooth"});
        }
      }
    }
    );
  
    //subscribe to an event when cpu-chart-overview bubble is clicked 
    this.analyticsService.currentData.subscribe(data => this.clickedData = data);
    //subscribe to see if the host details has been called 
    this.analyticsService.currentHost.subscribe(data => {
      this.showHost = data
      if(this.showHost == true)
      {
        var hosts = document.getElementById("hosts");
        if(hosts != null)
        {
          hosts.scrollIntoView({behavior:"smooth"});
        }
      }
    });
  }


  public retrieveDatasetFromDatabase()
  {
    //Initializing the Scatterplot data (Get from database)
    
    //Get all cpu hosts data from database 
    var predictionArray1 = [3,4,3,4,5,3,5,4,2,3,4,5,3,2,2,1,1,2,3,4,5,3,2,5,3,4,3,2,1,2];
    var actualArray1 = [2,3,4,5,6,4,3,3,2,1,5,4,3,6,7,8,9,4,2,1,2,4,5,3,1,3,5,8,6,3];
    var labelArray1 = ['25/6/18 1:47:00','25/6/18 1:47:30','25/6/18 1:48:00','25/6/18 1:48:30','25/6/18 1:49:00','25/6/18 1:49:30','25/6/18 1:50:00','25/6/18 1:50:30','25/6/18 1:51:00','25/6/18 1:51:30','25/6/18 1:52:00','25/6/18 1:52:30','25/6/18 1:53:00','25/6/18 1:53:30','25/6/18 1:54:00','25/6/18 1:54:30','25/6/18 1:55:00','25/6/18 1:55:30','25/6/18 1:56:00','25/6/18 1:56:30','25/6/18 1:57:00','25/6/18 1:57:30','25/6/18 1:58:00','25/6/18 1:58:30','eee','fff','ggg','hhh','iii','jjj']

    var predictionArray2 = [2,3,4,4,5,4,3,2,4,5,5,4];
    var actualArray2 = [3,4,5,6,7,8,9,10,4,5,4,3];
    var labelArray2 = ['a','b','c','d','e','f','g','h','i','j','aa','bb'];

    var predictionArray3 = [10,11,12,13,14,16,14,15,16,16,12,13,14];
    var actualArray3 = [12,14,16,17,19,20,15,17,19,21,22,21,22];
    var labelArray3 = ['a','b','c','d','e','f','g','h','i','j','aa','bb','cc'];

    var host1 = new HostClass("string" , ['0.0', '1.0'] , '0.8' , predictionArray1, actualArray1 , labelArray1 );
    var host2 = new HostClass("string1" , ['0.0', '1.0'] , '0.4' , predictionArray2 , actualArray2 , labelArray2);
    var host3 = new HostClass("string" , ['10.0' , '6.0'] , '0.5' , predictionArray3, actualArray3 , labelArray3);

    //sort the cpu Hosts into same x and y 
    var arrayOfHosts = new Array<HostClass>();
    arrayOfHosts.push(host1, host2 , host3);
    var sortedList = this.sortHost(arrayOfHosts);

    // var cpuClassLow1 = new CpuClass('0.0' , '1.0' , 20 , null);
    // var cpuClassLow2 = new CpuClass('0.0' , '3.0' , 10  , null);
    // var cpuClassMedium1 = new CpuClass('5.0' , '2.0', 20 , null);
    // var cpuClassMedium2 = new CpuClass('5.0' , '3.0' , 20 , null);
    // var cpuClassHigh1 = new CpuClass('10.0' , '4.0', 20 , null);
    // var cpuClassHigh2 = new CpuClass('10.0', '6.0' , 40 , null);
    
    // var arrayOfAllData = new Array<CpuClass>();


    // //Push all data into array of all Data
    // arrayOfAllData.push(cpuClassLow1 , cpuClassLow2 , cpuClassMedium1 , cpuClassMedium2 , cpuClassHigh1 , cpuClassHigh2);
    //In progress of fitting data into here
    var array:any = this.sortData(sortedList);

    var arrayOfLowSet = array[0]; 
    var arrayOfMediumSet = array[1];
    var arrayOfHighSet = array[2];

    //use this to trasform data into dataset
    var lowDataSet:Array<CpuClass> = this.transformData(arrayOfLowSet);
    var mediumDataSet:Array<CpuClass> = this.transformData(arrayOfMediumSet);
    var highDataSet:Array<CpuClass> = this.transformData(arrayOfHighSet);

    //sync the dataSet with analytics service to be used in other components 
    this.analyticsService.$cpuLow = arrayOfLowSet; 
    this.analyticsService.$cpuMedium = arrayOfMediumSet; 
    this.analyticsService.$cpuHigh = arrayOfHighSet;
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

  private sortHost(dataSet:Array<HostClass>)
  {
    var integer = 0;
    var sortedData = new Array<CpuClass>();
    var unsortedData:Array<any> = new Array();
    dataSet.forEach(element => {
      unsortedData.push([element.$cpuData[0]+","+element.$cpuData[1] , element]);
    })

    if(integer == 0)
    {
      //Add the first set into the sorted data
      sortedData.push(unsortedData[0][0] , unsortedData[0][1]);
      integer++;
    }
    

    // var arr = [5, 5, 5, 2, 2, 2, 2, 2, 9, 4];
    var counts = new Array();
    var listOfLabels = new Array<string>(); 
    for (var i = 0; i < unsortedData.length; i++) {
      var num = unsortedData[i][0];
      listOfLabels.push(num);
      var array = new Array<HostClass>();
      if(counts[num] != undefined)
      {
        array = counts[num];
        array.push(unsortedData[i][1]);      
      }
      counts[num] = counts[num] ? counts[num] = array  : new Array<HostClass>(unsortedData[i][1]) ;
    }

    // console.log([counts , listOfLabels]);
    var unique = listOfLabels.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    }) 
    return ([counts , unique]);
  }

  private transformData(dataSet:Array<CpuClass>)
  {
    var array = new Array<any>();
    dataSet.forEach(element => {
      var data = {x:element.$x, y:element.$y , r:element.$r};
      array.push(data);
    });

    return array;
  }

  private sortData(dataSet:any){
    var lowSet = new Array<CpuClass>();
    var mediumSet = new Array<CpuClass>();
    var highSet = new Array<CpuClass>();
    var uniqueValue = dataSet[1];
    var data = dataSet[0];

    //Working on this
    var cpuArray:Array<CpuClass> = new Array<CpuClass>();

    //get all the values out from the compiled list and create cpu class
    uniqueValue.forEach(uv => {
      var x = uv.split(",")[0];
      var y = uv.split(",")[1];
      var r = data[uv].length * 10;
      var array:Array<HostClass> = data[uv];
      var cpuClass:CpuClass = new CpuClass(x , y , r , array);
      cpuArray.push(cpuClass);
    })
    cpuArray.forEach(element => {
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
