import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js'

@Component({
  selector: 'app-filtered-graphs',
  templateUrl: './filtered-graphs.component.html',
  styleUrls: ['./filtered-graphs.component.css']
})
export class FilteredGraphsComponent implements OnInit {
  model = "apps";
  toggle: boolean = false;
  toggle2: boolean = false;
  chart: any;

  labelSet = ["Browser", "Game", "Word Processing", "Database", "Spreadsheet", "Multimedia"];
  dataSet = [4, 59, 2, 35, 11, 21];
  text = "CPU Usage by application";
  label = "CPU usage of this application over the past 24 hours";

  labelSet2 = ["Application", "Security-Related", "System"];
  dataSet2 = [10, 32, 49];
  text2 = "Event Logs";
  label2 = "number of events related to this category"  

  labelSet3 = ["User", "Admin", "Root"];
  dataSet3 = [48, 38, 10];
  text3 = "Process Logs"
  label3 = "number of processes related to this category"

  labelSet4 = ["Browser", "Game", "Word Processing", "Database", "Spreadsheet", "Multimedia"];
  dataSet4 = [8, 60, 2, 8, 8, 14];
  text4 = "Batery Usage by application"
  label4 = "battery usage of this application over the past 24 hours";

  applicationClick() {
    this.toggle = false;
    this.createBarChart();
  }

  eventClick() {
    this.toggle = false;
    this.createBarChart();
    length = this.chart.data.labels.length;
    for (var i = 0; i < length; i++) {
      this.chart.data.labels.pop();
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      })
    }

    for (var i = 0; i < this.labelSet2.length; i++) {
      this.chart.data.labels.push(this.labelSet2[i]);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.push(this.dataSet2[i]);
      })
    }

    this.chart.options.title.text = this.text2; 
    this.chart.data.datasets.forEach((dataset) => {
      dataset.label = this.label2;
    })   
    this.chart.update();
  }

  processClick() {
    this.toggle = false;
    this.createBarChart();
    length = this.chart.data.labels.length;
    for (var i = 0; i < length; i++) {
      this.chart.data.labels.pop();
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      })
    }

    for (var i = 0; i < this.labelSet3.length; i++) {
      this.chart.data.labels.push(this.labelSet3[i]);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.push(this.dataSet3[i]);
      })
    }

    this.chart.options.title.text = this.text3;    
    this.chart.data.datasets.forEach((dataset) => {
      dataset.label = this.label3;
    })   
    this.chart.update();
  }

  cpuClick() {
    this.toggle2 = false;
    this.toggle = true;
    this.createLineChart();
  }

  cpuAppClick() {
    this.toggle2 = false;
    this.toggle = true;
    this.createBarChart();
    length = this.chart.data.labels.length;
    for (var i = 0; i < length; i++) {
      this.chart.data.labels.pop();
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      })
    }

    for (var i = 0; i < this.labelSet.length; i++) {
      this.chart.data.labels.push(this.labelSet[i]);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.push(this.dataSet[i]);
      })
    }

    this.chart.options.title.text = this.text;    
    this.chart.data.datasets.forEach((dataset) => {
      dataset.label = this.label;
    })   
    this.chart.update();
  }

  batteryClick() {
    this.toggle = false;
    this.toggle2 = true;
    this.createLineChart2();
  }

  batteryAppClick() {
    this.toggle = false;
    this.toggle2 = true;
    this.createBarChart();
    length = this.chart.data.labels.length;
    for (var i = 0; i < length; i++) {
      this.chart.data.labels.pop();
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      })
    }

    for (var i = 0; i < this.labelSet4.length; i++) {
      this.chart.data.labels.push(this.labelSet4[i]);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data.push(this.dataSet4[i]);
      })
    }

    this.chart.options.title.text = this.text4;    
    this.chart.data.datasets.forEach((dataset) => {
      dataset.label = this.label4;
    })   
    this.chart.update();
  }

  createBarChart() {
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ["Browser", "Game", "Word Processing", "Database", "Spreadsheet", "Multimedia"],
        datasets: [{
          label: 'number of applications related to',
          data: [24, 10, 30, 20, 46, 78],
          backgroundColor: 'rgba(54, 162, 235, 0.2',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointHoverBackgroundColor: 'red',
          borderWidth: 1
        }]
      },
      options: {
        title: {
          text: "Application Logs",
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }

  createLineChart() {
    this.chart.destroy();
    this.chart = new Chart('canvas', {
      type: 'line',      
      data: {
        labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
        datasets: [{
          label: "CPU usage at this time",
          data: ['20', '17', '0', '0', '0', '0', '0', '0', '0', '12', '15', '14', '19', '8', '12', '20', '60', '21', '12', '0', '0', '0', '0', '0'],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true
        }]
      }, 
      options: {
        title: {
          text: "CPU Usage by time",
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }) 
  }

  createLineChart2() {
    this.chart.destroy();
    this.chart = new Chart('canvas', {
      type: 'line',      
      data: {
        labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
        datasets: [{
          label: "Battery usage at this time",
          data: ['9', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '23', '22', '25', '21'],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true
        }]
      }, 
      options: {
        title: {
          text: "Battery Usage by time",
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }) 
  }
  constructor() { }

  ngOnInit() {
    this.createBarChart();
  }

}
