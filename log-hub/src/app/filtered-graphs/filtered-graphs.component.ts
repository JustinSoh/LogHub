import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js'

@Component({
  selector: 'app-filtered-graphs',
  templateUrl: './filtered-graphs.component.html',
  styleUrls: ['./filtered-graphs.component.css']
})
export class FilteredGraphsComponent implements OnInit {
 
  //Define Charts
  chart: any;
  chart2: any;

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

  createDoughnut() {
    if (this.chart2 != null) {
      this.chart2.destroy();
    }
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
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#212121';
  }

  ngOnInit() {
    this.createLineChart();
    this.createDoughnut();
  }
}


