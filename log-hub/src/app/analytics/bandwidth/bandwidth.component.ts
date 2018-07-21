import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { FormsModule } from '@angular/forms'
import { ViewEncapsulation } from '@angular/core';
import { TouchSequence } from '../../../../node_modules/@types/selenium-webdriver';

@Component({
  selector: 'app-bandwidth',
  templateUrl: './bandwidth.component.html',
  styleUrls: ['./bandwidth.component.css'],
  encapsulation: ViewEncapsulation.None


})
export class BandwidthComponent implements OnInit, OnChanges {


  private bandwidth: string;
  private data: string;
  private setLow: boolean;
  private setMedium: boolean;
  private setHigh: boolean
  private true = true
  public chart: any;
  private dataset: any
  private settings = false;
  private lowFrom = 0;
  private lowTo = 40;
  private mediumFrom = 41;
  private mediumTo = 80;
  private highFrom = 81;
  private highTo = 100
  private lowThreshold = 40;
  private mediumThreshold = 80;
  private highTreshold = 100;
  private error: boolean = false;
  private errorMessage: string;
  private input = 79;
  constructor() { }

  ngOnInit() {

    var currentBw = this.getCurrentBwBasedOnData(this.input);
    this.setCurrentBandwidth(currentBw, this.input);

  }
  ngOnChanges() {
    var currentBw = this.getCurrentBwBasedOnData(this.input);
    this.chart = this.updateCurrentBandwidth(currentBw, this.input)
  }
  getCurrentBwBasedOnData(num: number) {
    if (num <= this.lowTo) {
      return "Low"
    }
    else if (num < this.mediumTo) {
      return "Medium"
    }
    else if (num < this.highTo) {
      return "High"
    }
    else {
      return null
    }
  }

  closeSetting() {
    this.settings = false;
  }

  submitSettings() {

    var value1 = this.lowTo - this.lowFrom
    var value2 = this.mediumTo - this.mediumFrom + 1
    var value3 = this.highTo - this.highFrom + 1
    var total = value1 + value2 + value3;

    if (this.lowTo >= 0 && this.lowTo <= 100
      && this.lowFrom >= 0 && this.lowFrom <= 100
      && this.mediumTo >= 0 && this.mediumTo <= 100
      && this.mediumFrom >= 0 && this.mediumFrom <= 100
      && this.highTo >= 0 && this.highTo <= 100
      && this.highFrom >= 0 && this.highFrom <= 100
    ) {
      if (total == 100) {
        this.error = false;
        this.errorMessage = "";
        this.lowThreshold = this.lowTo;
        this.mediumThreshold = this.mediumTo;
        this.highTreshold - this.highTo;

        var currentBw = this.getCurrentBwBasedOnData(this.input);
        this.chart = this.updateCurrentBandwidth(currentBw, this.input);
        this.settings = false;
      }
      else {
        this.errorMessage = "Values do not add up to 100%"
        this.error = true;
      }
    }
    else {
      this.errorMessage = "Values must be within 0 - 100"
      this.error = true;
    }


  }
  testing() {
    console.log(this.lowFrom + "-" + this.lowTo);
    console.log(this.mediumFrom + "-" + this.mediumTo)
    console.log(this.highFrom + "-" + this.highTo)
    //this.setSettingChart(this.lowFrom , this.lowTo , this.mediumFrom , this.mediumTo , this.highFrom , this.highTo);


  }

  getSettingData(lowStart, lowEnd, mediumStart, mediumEnd, highStart, highEnd) {
    var dataList: Array<any> = new Array<any>();
    var labelList: Array<string> = new Array<string>();
    var lowData = lowEnd - lowStart;
    var mediumData = mediumEnd - mediumStart;
    var highData = highEnd - highStart;


    dataList.push(lowEnd);
    labelList.push("Low")
    dataList.push(mediumEnd);
    labelList.push("Medium")
    dataList.push(highEnd);
    labelList.push("High")

    return [dataList, labelList]
  }


  // setSettingChart(lowStart , lowEnd, mediumStart, mediumEnd, highStart, highEnd)
  // {
  //   var data = this.getSettingData(lowStart, lowEnd, mediumStart, mediumEnd, highStart, highEnd);
  //   if(this.settingChart == null)
  //   {
  //     console.log("is this working")
  //     this.settingChart = new Chart("newChart" , {
  //       type: 'doughnut',
  //       data: {
  //         datasets: [{
  //           data: data[0],
  //           backgroundColor:["#4EAB7E","#FF8400" , "#D44343" ]
  //        }],
  //        labels: data[1]

  //       },
  //       options : {
  //         responsive: true,
  //         maintainAspectRatio: true,

  //       }
  //     })
  //   } 
  //   else {
  //     this.settingChart.data.datasets = [{
  //       data: data[0],
  //       backgroundColor:["#4EAB7E","#FF8400" , "#D44343" ]
  //    }],
  //     this.settingChart.data.labels = data[1]
  //     this.settingChart.update();
  //   }

  // }

  flip() {
    this.settings = (this.settings == false) ? true : false;
    console.log(this.settings);
    console.log(this.chart)
    if (this.settings == true) {
      console.log("testing")
      //this.setSettingChart(this.lowFrom , this.lowTo , this.mediumFrom , this.mediumTo , this.highFrom , this.highTo);
      //var currentBw = this.getCurrentBwBasedOnData(39);
      //var currentBw = "Low"
      //var data = 39;
      //this.setCurrentBandwidth(currentBw ,  data);


    }
  }
  setCurrentBandwidth(bandwidth: string, currentPercentage: number) {
    this.bandwidth = bandwidth
    this.data = currentPercentage.toString() + "%"
    var leftover = 100 - currentPercentage;
    this.dataset = this.getCurrentDatasetForBandwidth(leftover, currentPercentage)
    this.chart = this.createChart(this.dataset, bandwidth.toLowerCase())
  }

  updateCurrentBandwidth(bandwidth: string, currentPercentage: number) {
    this.bandwidth = bandwidth
    this.data = currentPercentage.toString() + "%"
    var leftover = 100 - currentPercentage;
    this.dataset = this.getCurrentDatasetForBandwidth(leftover, currentPercentage)
    console.log(this.dataset)
    this.chart = this.updateChart(this.dataset, bandwidth.toLowerCase())
    return this.chart;
  }
  getCurrentDatasetForBandwidth(leftover: number, current: number) {
    var dataset: Array<any> = new Array<any>();
    dataset.push(current)
    dataset.push(leftover)
    return dataset;
  }

  createChart(data: any, riskLevel) {
    var color = ""
    if (riskLevel.toLowerCase() == "high") {
      color = "#D44343"
    }
    else if (riskLevel.toLowerCase() == "medium") {
      color = "#FF8400"
    }
    else if (riskLevel.toLowerCase() == "low") {
      color = "#4EAB7E"
    }

    var options = this.chartOptions(riskLevel.toLowerCase(), color);

    console.log("this happens");
    console.log(this.chart);
    this.chart = new Chart("bandwidthChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: data,
          backgroundColor: [color, "#A9A9A9"]
        }],
        labels: [
          'Usage',
          'Remainder'
        ]

      },
      options: options
    })
    return this.chart;


  }

  updateChart(data: any, riskLevel) {
    console.log(data);
    var color = ""
    if (riskLevel.toLowerCase() == "high") {
      color = "#D44343"
    }
    else if (riskLevel.toLowerCase() == "medium") {
      color = "#FF8400"
    }
    else if (riskLevel.toLowerCase() == "low") {
      color = "#4EAB7E"
    }
    console.log("does this happens");
    console.log(this.chart);
    this.chart.data.datasets = [{ data: data, backgroundColor: [color, "#A9A9A9"] }]
    this.chart.options = this.chartOptions(riskLevel.toLowerCase(), color);
    this.chart.update();
    return this.chart;
  }


  chartOptions(riskLevel, color) {
    var options = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false
      },
      elements: {
        center: {
          text: riskLevel.substring(0, 1).toUpperCase() + riskLevel.substring(1),
          color: color, //Default black
          fontStyle: 'Helvetica', //Default Arial
          sidePadding: 40 //Default 20 (as a percentage)
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, chartData) {
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
    return options;
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
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
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
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }


});





