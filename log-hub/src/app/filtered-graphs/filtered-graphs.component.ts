import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import { CpuDetailsService } from '../services/cpu-details.service';
import { CpuLogsService } from '../services/cpu-logs.service';

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
  dataset = [];
  dataset2 = [];
  timeset = [];
  colorset = [];
  colorset2 = [];

  currentHost: string;
  //CPU Values
  cpuAverage: number;
  chromeAverage: number;

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
  hosts = [];

  createLineChart() {
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.timeset,
        datasets: [{
          data: this.dataset,
          pointBackgroundColor: this.colorset,
          pointBorderColor: this.colorset,
          pointRadius: 2,
          pointHoverRadius: 4,
          backgroundColor: 'black',
          fill: true
        }]
      },
      options: {
        animation: false,
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
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems, data) {
              return tooltipItems.yLabel + '% CPU Usage'
            }
          }
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
        labels: this.timeset,
        datasets: [{
          data: this.dataset2,
          pointBackgroundColor: this.colorset2,
          pointBorderColor: this.colorset2,
          pointRadius: 2,
          pointHoverRadius: 4,
          backgroundColor: 'black',
          fill: true
        }]
      },
      options: {
        animation: false,
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
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems, data) {
              return tooltipItems.yLabel + '% Chrome Usage'
            }
          }
        }
      }
    })
  }

  createDoughnut() {
    this.chart2 = new Chart('doughnut-canvas', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.cpuAverage, 100 - this.cpuAverage],
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

  createDoughnut2() {
    this.chart2 = new Chart('doughnut-canvas2', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.chromeAverage, 100 - this.chromeAverage],
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
    if (selected == "CPU Usage") {
      this.createLineChart()
    } else if (selected == "Chrome Usage") {
      this.createLineChart2()
    }
  }

  hostChange(selected: any) {
    this.cpuLogsService.getItems2(selected).subscribe(data => {
      this.chart.destroy()
      this.dataset = []
      this.timeset = []
      for (var i = 0; i < data.length; i++) {
        this.dataset.push(data[i]['usage'])
        this.timeset.push(data[i]['time'])
      }
      this.createLineChart();
    })
  }

  constructor(private modalService: NgbModal, private elementRef: ElementRef, private cpuDetailsService: CpuDetailsService, private cpuLogsService: CpuLogsService) {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#212121';
  }

  ngOnInit() {
    this.sessions = ["CPU Usage", "Chrome Usage"]

    this.cpuLogsService.getItems().subscribe(data => {
      this.dataset = []
      this.dataset2 = []
      this.timeset = []
      this.colorset = []
      this.colorset2 = []

      var duplicates = []

      var total = 0
      var count = 0

      for (var i = 0; i < data.length; i++) {
        duplicates.push(data[i]['hostname'])

        for (let i = 0; i < duplicates.length; i++) {
          if (this.hosts.indexOf(duplicates[i]) == -1) {
            this.hosts.push(duplicates[i])
          }
        }

        this.dataset.push(data[i]['usage'])
        this.dataset2.push(data[i]['chrome'])
        this.timeset.push(data[i]['time'])

        total += data[i]['usage']
        count++

        if (data[i]['cpuRisk'] == 'high') {
          this.colorset.push('red')
        }
        else if (data[i]['cpuRisk'] == 'low') {
          this.colorset.push('lime')
        }
        else if (data[i]['cpuRisk'] == 'medium') {
          this.colorset.push('yellow')
        }
        else if (data[i]['cpuRisk'] == 'training') {
          this.colorset.push('cyan')
        }

        if (data[i]['chromeRisk'] == 'high') {
          this.colorset2.push('red')
        }
        else if (data[i]['chromeRisk'] == 'low') {
          this.colorset2.push('lime')
        }
        else if (data[i]['chromeRisk'] == 'medium') {
          this.colorset2.push('yellow')
        }
        else if (data[i]['chromeRisk'] == 'training') {
          this.colorset2.push('cyan')
        }
      }
      this.cpuAverage = total/count
      this.createLineChart();
    })

    this.cpuDetailsService.getItem().subscribe(data => {
      this.chromeAverage = data[0]['chromeAverage']
      this.firstTitle = data[0]['ev1']
      this.secondTitle = data[0]['ev2']
      this.thirdTitle = data[0]['ev3']
      this.firstDesc = data[0]['desc1']
      this.secondDesc = data[0]['desc2']
      this.thirdDesc = data[0]['desc3']
      this.createDoughnut();
      this.createDoughnut2();
    })

  }
}


