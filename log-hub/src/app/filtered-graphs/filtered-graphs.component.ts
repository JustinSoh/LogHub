import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  toggler: boolean = false;
  chart: any;
  chart2: any;
  closeResult: string;

  labelSet = ["Browser", "Game", "Word Processing", "Database", "Spreadsheet", "Multimedia"];
  dataSet = [4, 59, 2, 35, 11, 21];
  text = "CPU Usage by application";
  label = "CPU usage of this application over the past 24 hours";

  labelSet2 = ["Application", "Security", "System"];
  dataSet2 = [10, 32, 49];
  text2 = "Event Logs";
  label2 = "Number of events related to"

  labelSet3 = ["User", "Admin", "Root"];
  dataSet3 = [48, 38, 10];
  text3 = "Process Logs"
  label3 = "Number of processes related to"

  labelSet4 = ["Browser", "Game", "Word Processing", "Database", "Spreadsheet", "Multimedia"];
  dataSet4 = [8, 60, 2, 8, 8, 14];
  text4 = "Batery Usage by application"
  label4 = "Battery usage of this application over the past 24 hours";

  currentData: any;
  category: any;
  modalLabel: any;

  graphClick(event, content) {
    var index = this.chart.getElementAtEvent(event)[0]._index;
    console.log(index);
    this.currentData = this.chart.config.data.datasets[0].data[index];
    this.category = this.chart.config.data.labels[index];
    this.modalLabel = this.chart.config.data.datasets[0].label;
    this.modalService.open(content);
  }


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

  info() {
    if (this.toggler) {
      this.cpuClick();
    } else {
      this.batteryClick();
    }
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
          label: 'Number of applications related to',
          data: [24, 10, 30, 20, 46, 78],
          backgroundColor: 'rgba(54, 162, 235, 0.2',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointHoverBackgroundColor: 'red',
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
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
          label: "CPU usage at",
          data: ['20', '17', '0', '0', '0', '0', '0', '0', '0', '12', '15', '14', '19', '8', '12', '20', '60', '21', '12', '0', '0', '0', '0', '0'],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
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
          label: "Battery usage at",
          data: ['9', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '23', '22', '25', '21'],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
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

  createDoughnut() {
    this.toggler = true;
    if (this.chart2 != null) {
      this.chart2.destroy();
    }
    this.chart2 = new Chart('canvas2', {
      plugins: [{
        afterUpdate: function (chart) {
          if (chart.config.options.elements.center) {
            var helpers = Chart.helpers;
            var centerConfig = chart.config.options.elements.center;
            var globalConfig = Chart.defaults.global;
            var ctx = chart.chart.ctx;

            var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
            var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

            if (centerConfig.fontSize)
              var fontSize = centerConfig.fontSize;
            // figure out the best font size, if one is not specified
            else {
              ctx.save();
              var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
              var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
              var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

              do {
                ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
                var textWidth = ctx.measureText(maxText).width;

                // check if it fits, is within configured limits and that we are not simply toggling back and forth
                if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                  fontSize += 1;
                else {
                  // reverse last step
                  fontSize -= 1;
                  break;
                }
              } while (true)
              ctx.restore();
            }

            // save properties
            chart.center = {
              font: helpers.fontString(fontSize, fontStyle, fontFamily),
              fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
            };
          }
        },
        afterDraw: function (chart) {
          if (chart.center) {
            var centerConfig = chart.config.options.elements.center;
            var ctx = chart.chart.ctx;

            ctx.save();
            ctx.font = chart.center.font;
            ctx.fillStyle = chart.center.fillStyle;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            ctx.fillText(centerConfig.text, centerX, centerY);
            ctx.restore();
          }
        },
      }],
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [67, 33],
            backgroundColor: ["#FF6684", "#ccc"]
          }
        ]
      },
      options: {
        tooltips: {
          enabled: false
        },
        hover: {
          mode: null
        },
        elements: {
          center: {
            // the longest text that could appear in the center
            maxText: '100%',
            text: '67%',
            fontColor: '#FF6684',
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            fontStyle: 'normal',
            // fontSize: 12,
            // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
            // if these are not specified either, we default to 1 and 256
            minFontSize: 1,
            maxFontSize: 256,
          }
        },
        title: {
          display: true,
          text: 'Average CPU usage over the last 24 hours'
        }
      },
    })
  }

  createDoughnut2() {
    this.toggler = false;
    this.chart2.destroy();
    this.chart2 = new Chart('canvas2', {
      plugins: [{
        afterUpdate: function (chart) {
          if (chart.config.options.elements.center) {
            var helpers = Chart.helpers;
            var centerConfig = chart.config.options.elements.center;
            var globalConfig = Chart.defaults.global;
            var ctx = chart.chart.ctx;

            var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
            var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

            if (centerConfig.fontSize)
              var fontSize = centerConfig.fontSize;
            // figure out the best font size, if one is not specified
            else {
              ctx.save();
              var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
              var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
              var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

              do {
                ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
                var textWidth = ctx.measureText(maxText).width;

                // check if it fits, is within configured limits and that we are not simply toggling back and forth
                if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                  fontSize += 1;
                else {
                  // reverse last step
                  fontSize -= 1;
                  break;
                }
              } while (true)
              ctx.restore();
            }

            // save properties
            chart.center = {
              font: helpers.fontString(fontSize, fontStyle, fontFamily),
              fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
            };
          }
        },
        afterDraw: function (chart) {
          if (chart.center) {
            var centerConfig = chart.config.options.elements.center;
            var ctx = chart.chart.ctx;

            ctx.save();
            ctx.font = chart.center.font;
            ctx.fillStyle = chart.center.fillStyle;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            ctx.fillText(centerConfig.text, centerX, centerY);
            ctx.restore();
          }
        },
      }],
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [47, 53],
            backgroundColor: ["#FF6684", "#ccc"]
          }
        ]
      },
      options: {
        tooltips: {
          enabled: false
        },
        hover: {
          mode: null
        },
        elements: {
          center: {
            // the longest text that could appear in the center
            maxText: '100%',
            text: '47%',
            fontColor: '#FF6684',
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            fontStyle: 'normal',
            // fontSize: 12,
            // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
            // if these are not specified either, we default to 1 and 256
            minFontSize: 1,
            maxFontSize: 256,
          }
        },
        title: {
          display: true,
          text: 'Average battery usage over the last 24 hours'
        }
      },
    })
  }

  constructor(private modalService: NgbModal) {

  }

  ngOnInit() {
    this.createBarChart();
    this.createDoughnut();
  }
}


