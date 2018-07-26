import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js'

@Component({
  selector: 'app-filtered-graphs',
  templateUrl: './filtered-graphs.component.html',
  styleUrls: ['./filtered-graphs.component.css']
})
export class FilteredGraphsComponent implements OnInit {

  toggle: boolean = true;
  toggle2: boolean = false;

  //Define chart stuff
  chart: any;
  chart2: any;
  dataset = [67, 33];
  dataset2 = [43, 57];

  //CPU Values
  cpuAverage: string;
  cpuFirst: string;
  cpuSecond: string;
  cpuThird: string;
  firstPercentage: string;
  secondPercentage: string;
  thirdPercentage: string;

  //Event Values
  firstTitle: string;
  secondTitle: string;
  thirdTitle: string;
  firstDesc: string;
  secondDesc: string;
  thirdDesc: string;

  //Risk Values
  eventRisk: string;
  cpuRisk: string;
  chromeRisk: string;

  //Session Values
  sessions = [];

  createLineChart() {
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['1400', '1410', '1420', '1430', '1440', '1450', '1500', '1510', '1520', '1530', '1540'],
        datasets: [{
          data: ['20', '17', '25', '50', '12', '24', '9', '8', '10', '20', '30'],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: false
        },
        legend: {
          display: false
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
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['1000', '1010', '1020', '1030', '1040', '1050'],
        datasets: [{
          data: ['10', '13', '25', '50', '20', '27'],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: false
        },
        legend: {
          display: false
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
    if (this.chart2 != null) {
      for (var i = 0; i <= this.chart2.data.datasets[0].data.length; i++) {
        this.chart2.data.datasets.forEach((dataset) => {
          dataset.data.pop();
        });
      }

      for (var i = 0; i < this.dataset.length; i++) {
        this.chart2.data.datasets.forEach((dataset) => {
          dataset.data.push(this.dataset[i]);
        });
      }
      this.chart2.update();
    } else {
      this.chart2 = new Chart('doughnut-canvas', {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [67, 33],
              backgroundColor: ["#2D98DC", "#222D33"],
              borderWidth: [0, 0]
            }
          ]
        },
        options: {
          cutoutPercentage: 70,
          tooltips: {
            enabled: false
          },
          hover: {
            mode: null
          }
        },
      })
    }
  }

  createDoughnut2() {
    if (this.chart2 != null) {
      for (var i = 0; i <= this.chart2.data.datasets[0].data.length; i++) {
        this.chart2.data.datasets.forEach((dataset) => {
          dataset.data.pop();
        });
      }

      for (var i = 0; i < this.dataset2.length; i++) {
        this.chart2.data.datasets.forEach((dataset) => {
          dataset.data.push(this.dataset2[i]);
        });
      }
      this.chart2.update();
    }
    this.chart2 = new Chart('doughnut-canvas', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [43, 57],
            backgroundColor: ["#2D98DC", "#222D33"],
            borderWidth: [0, 0]
          }
        ]
      },
      options: {
        cutoutPercentage: 70,
        tooltips: {
          enabled: false
        },
        hover: {
          mode: null
        }
      },
    })
  }

  sessionChange(selected: any) {
    if (selected == "Session 2") {
      this.cpuAverage = "43";
      this.cpuFirst = "chrome";
      this.cpuSecond = "steam";
      this.cpuThird = "svchost";
      this.firstPercentage = "16%";
      this.secondPercentage = "12%";
      this.thirdPercentage = "6%";

      this.firstTitle = "Application Event";
      this.secondTitle = "Application Event";
      this.thirdTitle = "Security Event";
      this.firstDesc = "Fault bucket 116204959230, type 5.";
      this.secondDesc = "Some application event";
      this.thirdDesc = "A user's local group membership was enumerated.";

      this.eventRisk = "LOW";
      this.cpuRisk = "LOW";
      this.chromeRisk = "HIGH";

      this.createLineChart2();
      this.createDoughnut2();
    } else if (selected == "Session 1") {
      this.cpuAverage = "67";
      this.cpuFirst = "chrome";
      this.cpuSecond = "svchost";
      this.cpuThird = "vsstudio";
      this.firstPercentage = "18%";
      this.secondPercentage = "8%";
      this.thirdPercentage = "4%";

      this.firstTitle = "Application Event";
      this.secondTitle = "System Event";
      this.thirdTitle = "Security Event";
      this.firstDesc = "Fault bucket 116204959230, type 5.";
      this.secondDesc = "The mfevtp MMS Service entered the running state.";
      this.thirdDesc = "A user's local group membership was enumerated.";

      this.eventRisk = "LOW";
      this.cpuRisk = "MODERATE";
      this.chromeRisk = "HIGH";

      this.createDoughnut();
      this.createLineChart();
    }
  }

  constructor(private modalService: NgbModal, private elementRef: ElementRef) {
    this.cpuAverage = "67";
    this.cpuFirst = "chrome";
    this.cpuSecond = "svchost";
    this.cpuThird = "vsstudio";
    this.firstPercentage = "18%";
    this.secondPercentage = "8%";
    this.thirdPercentage = "4%";

    this.firstTitle = "Application Event";
    this.secondTitle = "System Event";
    this.thirdTitle = "Security Event";
    this.firstDesc = "Fault bucket 116204959230, type 5.";
    this.secondDesc = "The mfevtp MMS Service entered the running state.";
    this.thirdDesc = "A user's local group membership was enumerated.";

    this.eventRisk = "LOW";
    this.cpuRisk = "MODERATE";
    this.chromeRisk = "HIGH";

    this.sessions = ["Session 1", "Session 2"]
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#212121';
  }

  ngOnInit() {
    this.createLineChart();
    this.createDoughnut();
  }
}


