import { Component, OnInit , Input } from '@angular/core';
import { Gchart } from 'src/app/class/gchart';
import {Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-cpu-chart-overview',
  templateUrl: './cpu-chart-overview.component.html',
  styleUrls: ['./cpu-chart-overview.component.css']
})
export class CPUChartOverview implements OnInit {

  @Input () cpuChartOverview:Gchart;
  public lineChartLegend:boolean = true;
  public lineChartType:String;
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  public chartLoaded: Boolean = false;
  public chart: any = null; 
  public dataArray = [];
  ngOnInit() {
    console.log(this.cpuChartOverview.$cpuOverviewType);
    console.log(this.cpuChartOverview.$cpuOverviewLabel);
    // this.UpdateChart(this.cpuChartOverview.$cpuOverviewData, this.cpuChartOverview.$cpuOverviewLabel, this.cpuChartOverview.$cpuOverviewType);
    this.createChart(this.cpuChartOverview.$cpuOverviewData, this.cpuChartOverview.$cpuOverviewLabel, this.cpuChartOverview.$cpuOverviewType);
  }

  public createBubbleChart(data , label , type)
  {
    var options = {
      type: type,
      data: {
        datasets: this.cpuChartOverview.$cpuOverviewData
      },
      options: this.bubbleChartOptions
      }
      this.chart = new Chart("canvas" , options); 
      this.chart.options.scales.xAxes[0].ticks.callback = function(value, index, values) {
          if(index == 0)
          {
            return 'Low';
          }
          if(index == 5)
          {
            return 'Medium';

          }
          if(index == 10)
          {
            return 'High';

          } },
      this.chart.options.scales.yAxes[0].ticks.callback = function(label, index, labels) {
              if(label ==6)
               {
                 return "Browser";
               }
               if(label == 5)
               {
                 return "Game";
               }
               if(label == 4)
               {
                 return "Word Processing";
               }
               if(label == 3)
               {
                 return "Database";
               }
               if( label == 2)
               {
                 return "Spreadsheet";
               }
               if( label == 1)
               {
                 return "Multimedia";
               }
             
              }
      this.chart.options.hover.mode = 'nearest';
      this.chart.options.hover.intersect = true;
      this.chart.options.tooltips.callbacks.label = function (tooltipItem, chartData)
      {
        var dataSet = tooltipItem.datasetIndex;
        var retrieveData = chartData.datasets[dataSet];
        var numberOfUser = retrieveData.data['0']['r'];
        var uriskLevel = tooltipItem.xLabel;
        var criskLevel;
        if(uriskLevel == 0)
        {
          criskLevel = "Low";
        }
      
        else if(uriskLevel == 5)
        {
          criskLevel =  "Medium";
        }
      
        else if(uriskLevel == 10)
        {
          criskLevel = "High";
        }
        var activityNo = tooltipItem.yLabel;
        var activityName = null;
        if(activityNo ==6)
        {
          activityName = "use a browser";
        }
        if(activityNo == 5)
        {
          activityName = "play a Game";
        }
        if(activityNo == 4)
        {
          activityName = "do Word Processing";
        }
        if(activityNo == 3)
        {
          activityName = "interact with a Database";
        }
        if( activityNo == 2)
        {
          activityName = "use a Spreadsheet";
        }
        if( activityNo == 1)
        {
          activityName = "engage in Multimedia";
        }
        // console.log(tooltipItem);
        // console.log(chartData);
        return "There are " + numberOfUser + " users at " + criskLevel + " risk level when they " + activityName;
      }
     
   
      this.chart.options.events.click = this.doSomething();

      this.chart.update();
     
  }

  
  public doSomething()
  {
    console.log("")
  }

  public createChart(data , label , type)
  {
    if(this.chart != null)
    {
      if(type == 'bubble')
      {
        this.createBubbleChart(data , label , type);
        
      }
    }
    if(this.chart == null)
    {
      if(type == 'bubble')
      {
        
        this.createBubbleChart(data , label , type);
        console.log("what is going on");
      }
    }
 
      
  }
  

  
  
  public bubbleChartOptions:any = {
    responsive: true,
    maintainAspectRatio: true, 
    ticks: {
      autoSkip: false
    }, 
    scaleShowValues: true,
    title: {
      display: false,
      text: 'CPU Overview ',
      fontSize: 18,
      fontWeight: 'Bold',
      fontColor: 'black',
      padding: 30,
      position: 'top',
    },
    legend: {
      padding: 100,
      fontSize: 9,
      fontWeight: 'Bold',
      fontColor: 'black',
      position: 'left',
    },
    layout: {
      padding: {
        top: 70,
        right:60

      }
    },
    tooltips: {
      mode: 'point',
    },
    scales: {
      xAxes: [{
          ticks: {
              // Include a dollar sign in the ticks
              // callback: function(value, index, values) {
              //     if(index == 0)
              //     {
              //       return 'Low';
              //     }
              //     if(index == 5)
              //     {
              //       return 'Medium';

              //     }
              //     if(index == 10)
              //     {
              //       return 'High';

              //     }
                   
              // },
              min: 0,
              max: 10,
              autoSkip:true,
              display: true,
              padding: 30,
              fontSize: 12,
              fontWeight: 'Bold',
              fontColor: 'black'

 
          }
      }],
      yAxes: [
        {
          ticks: {
            stepSize: 1,
            padding: 30,
            fontSize: 12,
            fontWeight: 'Bold',
            fontColor: 'black',
            autoSkip: false,
            max: 6, 
            min: 0,
            display: true,
            // callback: function(label, index, labels) {
            //   if(label ==6)
            //    {
            //      return "Browser";
            //    }
            //    if(label == 5)
            //    {
            //      return "Game";
            //    }
            //    if(label == 4)
            //    {
            //      return "Word Processing";
            //    }
            //    if(label == 3)
            //    {
            //      return "Database";
            //    }
            //    if( label == 2)
            //    {
            //      return "Spreadsheet";
            //    }
            //    if( label == 1)
            //    {
            //      return "Multimedia";
            //    }
             
            // }
          },
        
      
        }
      ]
    }
    
  };
  
  public lineChartColors:Array<any> = [
    { // grey
      borderColor: '#4EAB7E',
      pointBackgroundColor: '#4EAB7E',
      pointBorderColor: '#4EAB7E',
      backgroundColor: '#4EAB7E',
      pointRadius: 6,
      pointHoverRadius: 6
    }, 
   
    
  ];



 

  constructor() { }

 

}
