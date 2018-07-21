import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { FormsModule} from '@angular/forms' 
@Component({
  selector: 'app-bandwidth',
  templateUrl: './bandwidth.component.html',
  styleUrls: ['./bandwidth.component.css']
})
export class BandwidthComponent implements OnInit {


  private bandwidth: string; 
  private data: string;
  private setLow: boolean;
  private setMedium: boolean; 
  private setHigh: boolean
  private true = true
  private chart:any;
  private settingChart:any;
  private dataset: any
  private settings = false;
  private lowFrom = 0; 
  private lowTo = 40; 
  private mediumFrom = 41; 
  private mediumTo = 80; 
  private highFrom = 81; 
  private highTo = 100
  constructor() { }

  ngOnInit() {
    var currentBw = this.getCurrentBwBasedOnData(39);
    var currentBw = "Low"
    var data = 39;
    this.setCurrentBandwidth(currentBw ,  data);
  }

  getCurrentBwBasedOnData(num:number)
  {
    if(num <= this.lowTo )
    {
      return "Low"
    }
    else if(num < this.mediumTo)
    {
      return "Medium"
    }
    else if(num < this.highTo)
    {
      return "High"
    }
    else{
      return null
    }
  }

  submitSettings(){
    var value1 = this.lowTo - this.lowFrom
    var value2 = this.mediumTo - this.mediumFrom
    var value3 = this.highTo - this.highFrom
    var total = value1 + value2 + value3;
    if (total == 100)
    {
      console.log("fix later")
    }
  }
  testing() {
    console.log(this.lowFrom + "-" + this.lowTo);
    console.log(this.mediumFrom + "-" + this.mediumTo)
    console.log(this.highFrom + "-" + this.highTo)
    this.setSettingChart(this.lowFrom , this.lowTo , this.mediumFrom , this.mediumTo , this.highFrom , this.highTo);


  }

  getSettingData(lowStart , lowEnd, mediumStart, mediumEnd, highStart, highEnd)
  {
    var dataList:Array<any> = new Array<any>(); 
    var labelList:Array<string> = new Array<string>();
    var lowData = lowEnd - lowStart; 
    var mediumData = mediumEnd - mediumStart;
    var highData = highEnd - highStart;

    if(lowData - 0 != 0)
    {
      var startingRange = lowStart - 0;
      dataList.push(startingRange);
      labelList.push("Unallocated");

    }

    dataList.push(lowData + startingRange);
    labelList.push("Low")

    if(mediumStart - lowEnd != 1)
    {
      var emptySet = mediumStart - lowEnd; 
      dataList.push(emptySet);
      labelList.push("Unallocated");
    }

    dataList.push(mediumData);
    labelList.push("Medium")


    if(highStart - mediumEnd != 1)
    {
      var emptySet = highStart - mediumEnd; 
      dataList.push(emptySet);
      labelList.push("Unallocated");
    }


    dataList.push(highData);
    labelList.push("High")
    return [dataList,labelList]
  }


  setSettingChart(lowStart , lowEnd, mediumStart, mediumEnd, highStart, highEnd)
  {
    var data = this.getSettingData(lowStart, lowEnd, mediumStart, mediumEnd, highStart, highEnd);
    this.settingChart = new Chart("newChart" , {
        type: 'doughnut',
        data: {
          datasets: [{
            data: data[0],
            backgroundColor:["#4EAB7E","#FF8400" , "#D44343" ]
         }],
         labels: data[1]

        },
      })
  }
  
  flip() {
    this.settings = (this.settings == false) ? true : false;
    console.log(this.settings);
    if(this.settings == true)
    {
      console.log("testing")
      this.setSettingChart(this.lowFrom , this.lowTo , this.mediumFrom , this.mediumTo , this.highFrom , this.highTo);
      //var currentBw = this.getCurrentBwBasedOnData(39);
      //var currentBw = "Low"
      //var data = 39;
      //this.setCurrentBandwidth(currentBw ,  data);

      
    }
  }
  setCurrentBandwidth(bandwidth:string , currentPercentage:number)
  {
      this.bandwidth = bandwidth
      this.data = currentPercentage.toString() + "%"
      var leftover = 100 - currentPercentage; 
      this.dataset = this.getCurrentDatasetForBandwidth(leftover , currentPercentage )
      this.chart = this.updateChart(this.dataset, bandwidth.toLowerCase());
      

      
  }

  getCurrentDatasetForBandwidth(leftover:number, current:number )
  {
    var dataset:Array<any> = new Array<any>();
    dataset.push(current)
    dataset.push(leftover)
    return dataset;
  }

  updateChart(data:any , riskLevel)
  {
    var color = ""
    if(riskLevel.toLowerCase() == "high")
    {
      color = "#D44343"
    }
    else if (riskLevel.toLowerCase() == "medium")
    {
      color = "#FF8400"
    }
    else if (riskLevel.toLowerCase() == "low")
    {
      color = "#4EAB7E"
    }

    var options = { 
      responsive: true,
      maintainAspectRatio: true,
      legend:{
        display:false
      },
      elements: {
        center: {
        text: riskLevel.substring(0,1).toUpperCase()+riskLevel.substring(1),
        color: color, //Default black
        fontStyle: 'Helvetica', //Default Arial
        sidePadding: 40 //Default 20 (as a percentage)
      }
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, chartData) {
            var currentIndex = tooltipItem.index;
            var currentData = ""
            console.log(chartData);
            chartData.datasets.forEach(element => {
               currentData = element.data[currentIndex] + "%" + chartData.labels[currentIndex]
            });
            return currentData
          }
        }
      }
    }

    if(this.chart == null)
    {
      this.chart = new Chart("bandwidthChart", {
        type: 'doughnut',
        data: {
          datasets: [{
            data: data,
            backgroundColor:[color, "#A9A9A9"]
         }],
         labels: [
          'Usage',
          'Remainder'
          ]

        },
        options: options
        })

    }
    else { 

    }

  }
}


Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;

      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse+"px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});



