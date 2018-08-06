import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { FormsModule } from '@angular/forms'
import { ViewEncapsulation } from '@angular/core';
import { TouchSequence } from '../../../../node_modules/@types/selenium-webdriver';
import { WebapiService } from '../../services/webapi.service';
import { User } from '../../class/user';
import { UserService } from '../../services/user.service';
import { OrganizationService } from '../../services/organization.service';
import { BandwidthService } from '../../services/bandwidth.service';
import { Bandwidth } from '../../class/bandwidth';
import { Router } from '../../../../node_modules/@angular/router';
import { AnalyticsService } from '../services/analytics.service';
import { Indivdualbandwidth } from '../../class/indivdualbandwidth';
import { IndividualbandwidthService } from '../../services/individualbandwidth.service';
import { HostmappingService } from '../../services/hostmapping.service';
import { HostMapping } from '../../class/host-mapping';
import { Organization } from '../../class/organization';

@Component({
  selector: 'app-bandwidth',
  templateUrl: './bandwidth.component.html',
  styleUrls: ['./bandwidth.component.css'],


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
  private webApi: WebapiService;
  private currentUser: User;
  private userService: UserService;
  private bandwidthService: BandwidthService;
  private dataLoading: Boolean = false;
  private bandwidthValue: String = "Loading . . .";
  private bandwidthStatus: String = "Loading . . .";
  private bwData: Array<Bandwidth> = new Array<Bandwidth>();
  private mainData: Array<Bandwidth> = new Array<Bandwidth>();
  private mostRecent: Bandwidth;
  private overviewTime: Date;
  private overviewUsage: string;
  private overviewStatus: string;
  private lowTrue: Boolean;
  private mediumTrue: Boolean;
  private highTrue: Boolean;
  private veryhighTrue: Boolean;
  private trainingTrue: Boolean
  private router: Router;
  private informationMessage: String;
  private analyticsService: AnalyticsService
  private individualBw: IndividualbandwidthService;
  private filterLive: Boolean = true;
  private filterAll: Boolean = false;
  private filterDay: Boolean = false;
  private filterWeek: Boolean = false;
  private detailsText: String;
  private indBwData: Array<Indivdualbandwidth> = new Array<Indivdualbandwidth>();
  private showDrilledData: Boolean = false;
  private selectedData: Array<any> = new Array<any>();
  private hostDetails: Boolean = false;
  private hostName: any = "";
  private organizationName: String = ""
  private organizationService: OrganizationService;
  private hostMapService: HostmappingService;
  private currentHM: HostMapping;
  private IPAddress: String;
  private MACAddress: String;
  private DefaultGateway: String;
  private ThresholdValue: Number;
  private ThresholdValueEnd: Number;
  private problemLog: Array<Indivdualbandwidth> = new Array<Indivdualbandwidth>();
  private WarningMessage: String = "Nothing";
  private alertMessage: String = "Nothing";
  private uploadCount: Number;
  private downloadCount: Number;
  private numberOfCount: Number = 0;
  private firstRow = ['Hostname', 'Organization Name', 'Total Upload (MB)', 'Total Download (MB)', 'Total (MB)', 'Action']
  private comhour: string;
  private comday: string;
  constructor(webapi: WebapiService, userService: UserService, bandwidthService: BandwidthService, router: Router, as: AnalyticsService, individualBandwidth: IndividualbandwidthService
    , organizationService: OrganizationService, hostMapService: HostmappingService
  ) {
    this.webApi = webapi;
    this.userService = userService;
    this.bandwidthService = bandwidthService;
    this.router = router;
    this.analyticsService = as;
    this.individualBw = individualBandwidth;
    this.organizationService = organizationService;
    this.hostMapService = hostMapService;

  }

  getDataThatHasBeenProcessed(bwData: Array<Bandwidth>) {
    var returnData: Array<Bandwidth> = new Array<Bandwidth>();
    bwData.forEach(data => {
      if (data.$riskScore.toLowerCase() == "high" || data.$riskScore.toLowerCase() == "very high" || data.$riskScore.toLowerCase() == "medium" || data.$riskScore.toLowerCase() == "low" || data.$riskScore.toLowerCase() == "training") {
        returnData.push(data)
      }
    })
    return returnData;
  }
  ngOnInit() {
    this.webApi.user.subscribe(data => {
      if (data == null) {
        this.router.navigate(['/']);
      }
      else {
        this.currentUser = data;
        var indBwID: Array<string> = new Array<string>();

        this.bandwidthService.getBandwidthBasedOnId(this.currentUser.$organizationId).valueChanges().subscribe(data => {
          this.bwData = [];
          data.forEach(bwDataInd => {
            var currentbw: Bandwidth = this.bandwidthService.convertBandwidth(bwDataInd);
            this.bwData.push(currentbw)
          })
          // this.analyticsService.BwDataDetails(this.bwData)
          this.bwData = this.getDataThatHasBeenProcessed(this.bwData);
          // this.bwData.forEach(data => {
          //   // console.log(data.$usage + " check this ")
          // })
          this.mainData = this.bwData;
          var type = "live"
          if (this.filterLive == true) {
            type = "live"
          }
          if (this.filterAll == true) {
            type = "all"
          }
          if (this.filterDay == true) {
            type = "day"
          }
          if (this.filterWeek == true) {
            type = "week"
          }
          this.bwData = this.updateCurrentInformation(this.bwData, type)
          this.indBwData = new Array<Indivdualbandwidth>();
          this.individualBw.getBandwidthID().subscribe(data => {
            // console.log(data);
            indBwID = new Array<string>();
            this.indBwData = new Array<Indivdualbandwidth>();
            data.forEach(element => {
              var docId = element['payload']['doc']['id'];
              indBwID.push(docId);
              // console.log(indBwID);
            });

            this.individualBw.getBandwidth().subscribe(data => {
              this.indBwData = new Array<Indivdualbandwidth>();
              for (var i = 0; i < data.length; i++) {
                var indID = indBwID[i];
                var indBwObj = this.individualBw.convertIndBandwidthFromData(indID, data[i]);
                this.indBwData.push(indBwObj)
                // console.log(indBwObj);
              }

              this.individualBw.getSpecificThresholdBasedOnOrganizationAndUserID(this.currentUser.$userId, this.currentUser.$organizationId).valueChanges().subscribe(data => {
                var threshHoldValue = -100;
                var threshHoldValueEnd = 1000;
                var WarningMessage = "";
                this.numberOfCount = 0;
                this.uploadCount = 0;
                this.downloadCount = 0;
                var problemLog = new Array<Indivdualbandwidth>();
                var uploadLog = new Array<Indivdualbandwidth>();
                var downloadLog = new Array<Indivdualbandwidth>();
                data.forEach(tresh => {
                  console.log(tresh);
                  threshHoldValueEnd = tresh['thresholdLevelEnd']
                  threshHoldValue = tresh['thresholdLevel']
                  WarningMessage = tresh['warningMessage']
                })
                // console.log(this.indBwData.length)
                this.indBwData.forEach(data1 => {
                  var upload: Number = data1.$upload;
                  var download: Number = data1.$download
                  if (download < threshHoldValue || download > threshHoldValueEnd) {
                    downloadLog.push(data1)
                  }
                  if (upload < threshHoldValue || upload > threshHoldValueEnd) {
                    uploadLog.push(data1)
                  }
                  if (download < threshHoldValue || download > threshHoldValueEnd || upload < threshHoldValue || upload > threshHoldValueEnd) {
                    problemLog.push(data1)
                  }
                  //   // console.log(data.$download + "|" + threshHoldValue)
                  // if ( upload < threshHoldValueEnd || upload > threshHoldValue) {
                  //   // console.log(data.$download + "|" + data.$upload)
                  //   this.problemLog.push(data1)
                  // }
                  this.alertMessage = WarningMessage;
                  this.numberOfCount = problemLog.length;
                  this.uploadCount = uploadLog.length;
                  this.downloadCount = downloadLog.length;
                })
              })
            })

            this.analyticsService.currentDetails.subscribe(data => {
              this.hostDetails = data;
            })

            this.analyticsService.currentHost.subscribe(data => {
              this.hostName = data;
              var type = ""
              if (this.filterAll == true) {
                type = "all"
              }
              if (this.filterLive == true) {
                type = "live"
              }
              if (this.filterDay == true) {
                type = "day"
              }
              this.hostName = [data, type, this.comday, this.comhour]
            })

          });
        
        }
      )}
        
      
    
    });
  }

  processDataMappingPerDay(bwData: Array<Bandwidth>) {
    var dataMapping: Map<Number, Array<Bandwidth>> = new Map<Number, Array<Bandwidth>>();
    bwData.forEach(element => {
      var time: Date = element.$time
      var day = time.getDate();
      if (dataMapping.get(day)) {
        var arrayBW = dataMapping.get(day);
        arrayBW.push(element);
        dataMapping.set(day, arrayBW);

      }
      else {
        var newArray: Array<Bandwidth> = new Array<Bandwidth>();
        newArray.push(element);
        dataMapping.set(day, newArray)
      }
    });
    return dataMapping;
  }

  processRiskScorePerDay(riskScore: Map<String, number>) {
    var total = 0
    riskScore.forEach((value: Number, key: String) => {
      if (key != "training") {
        total = total + Number(value);
      }
    })
    var lowTotal = 0;
    var mediumTotal = 0;
    var highTotal = 0;
    var veryHigh = 0;
    // var training = 0;
    riskScore.forEach((value: Number, key: String) => {
      // if(key.toLowerCase() == "training")
      // {
      //   training = training + Number(value);
      // }
      if (key.toLowerCase() == "low") {
        lowTotal = lowTotal + Number(value);
      }
      if (key.toLowerCase() == "medium") {
        mediumTotal = mediumTotal + Number(value);
      }
      if (key.toLowerCase() == "high") {
        highTotal = highTotal + Number(value);
      }
      if (key.toLowerCase() == "very high") {
        veryHigh = veryHigh + Number(value);
      }

    })
    // console.log("Training total is " + training)


    var overall = lowTotal + mediumTotal + highTotal + veryHigh
    // var trainingPercentage = (training / overall) * 100
    var lowPercentage = (lowTotal / overall) * 100
    var mediumPercentage = (mediumTotal / overall) * 100
    var highPercentage = (highTotal / overall) * 100
    var veryHighPercentage = (veryHigh / overall) * 100


    // console.log("Training perc is " + trainingPercentage)

    var array: Array<Number> = new Array<Number>();
    array.push(lowPercentage);
    array.push(mediumPercentage);
    array.push(highPercentage);
    array.push(veryHighPercentage);

    array = array.sort((a: any, b: any) =>
      b - a
    );
    var winner = array[0]
    var winningCategory = ""
    if (winner == lowPercentage) {
      winningCategory = "low";
    }
    else if (winner == mediumPercentage) {
      winningCategory = "medium";
    }
    else if (winner == highPercentage) {
      winningCategory = "high";
    }
    else if (winner == veryHighPercentage) {
      winningCategory = "very high";
    }
    return [winningCategory, winner]
    //fix later  
    //this.caculateStandardDeviation([9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4])


  }
  caculateStandardDeviation(value: Array<number>) {
    var total = 0
    for (var i = 0; i < value.length; i++) {
      total = total + value[i];
    }
    var mean = total / value.length;
    var xiTotal = 0;
    for (var i = 0; i < value.length; i++) {
      var xi = (value[i] - mean) * (value[i] - mean)
      xiTotal = xiTotal + xi;
    }

    var variance = (1 / value.length) * xiTotal;
    var sd = Math.sqrt(variance)
    // console.log(sd)

  }

  updateCurrentInformation(bwData, type) {
    var dontUpdateLabel = false;
    bwData = this.sortInformation(bwData);
    if (type == "all") {
      // this.showDrilledData = false;
      this.analyticsService.DetailStatus(false);
      this.analyticsService.HostStatus(null);
      bwData = this.mainData
      bwData = this.sortInformation(bwData);
      if (this.chart != null) {
        this.chart.options.scales.yAxes[0].ticks.stepSize = 20;
        this.chart.update();
      }
      dontUpdateLabel = false;
    }
    if (type == "live") {
      // this.showDrilledData = false;
      this.analyticsService.DetailStatus(false);
      this.analyticsService.HostStatus(null);
      bwData = this.mainData;
      if (bwData.length > 30) {
        this.mainData = bwData;
        bwData = bwData.slice(bwData.length - 30, bwData.length)
      }
      if (this.chart != null) {
        this.chart.options.scales.yAxes[0].ticks.stepSize = 20;
        this.chart.update();
      }
      dontUpdateLabel = false;

    }
    if (type == "day") {
      // this.showDrilledData = false;
      this.analyticsService.DetailStatus(false);
      this.analyticsService.HostStatus(null);
      var arrayOfData: Array<Bandwidth> = new Array<Bandwidth>();
      bwData = this.mainData;
      bwData = this.sortInformation(bwData);
      var dataMapping: Map<Number, Array<Bandwidth>> = this.processDataMappingPerDay(bwData);
      dataMapping.forEach((value: Array<Bandwidth>, key: Number) => {
        var totalUsage = 0;
        var organizationId = ""
        var riskScore: Map<String, number> = new Map<String, number>();
        var time: Date;
        value.forEach(bw => {
          totalUsage = totalUsage + Number(bw.$usage)
          organizationId = bw.$organizationId;
          time = bw.$time;
          if (riskScore.get(bw.$riskScore)) {
            riskScore.set(bw.$riskScore, riskScore.get(bw.$riskScore) + 1);
          }
          else {
            riskScore.set(bw.$riskScore, 1);
          }

        })
        var bandwidthId = "total" + key;
        var hostId = "total" + key;
        var riskScoreTotalPerDay = this.processRiskScorePerDay(riskScore);
        var riskScoreValue = riskScoreTotalPerDay[0];
        var totalBw1 = new Bandwidth(bandwidthId, hostId, true, organizationId, riskScoreValue.toString(), time, totalUsage.toString(), true);
        arrayOfData.push(totalBw1);
        // console.log("The risk is " + riskScoreTotalPerDay[0] + " at " + riskScoreTotalPerDay[1] + "percent")
        // var totalbw1 = new Bandwidth(bandwidthId , hostId , True , organizationId , )
      });
      bwData = arrayOfData;
      var information: Map<string, any> = this.getUsageData(bwData);
      var dateArray: Array<string> = new Array<string>();
      var timeMap = information.get("Time")
      timeMap.forEach(element => {
        var date = element.get("DateAct") + "/" + element.get("Month") + "/" + element.get("Year")
        dateArray.push(date);
      });
      this.chart.data.labels = dateArray;
      this.chart.options.scales.yAxes[0].ticks.stepSize = 1000;
      this.chart.update();
      dontUpdateLabel = true;
    }
    // if(this.bwData.length > 30)
    // {
    // }
    this.bwData = bwData;
    this.mostRecent = bwData[bwData.length - 1];
    // console.log(this.mostRecent.$usage)
    // console.log(this.mostRecent.$riskScore)
    this.overviewUsage = this.mostRecent.$usage;
    this.overviewStatus = this.mostRecent.$riskScore
    this.setColour(this.overviewStatus)
    this.createChart(bwData, type, dontUpdateLabel);
    return bwData;
  }

  sortInformation(information) {
    var information2 = information.sort((a: any, b: any) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    console.log(information2)
    return information2

  }

  createChart(bwData: Array<Bandwidth>, type, dontUpdateLabel) {
    var dataSet: Array<Number> = new Array<Number>();
    var information: Map<string, any> = this.getUsageData(bwData);
    var radius = 3
    if (type == "live" || type == "day") {
      radius = 5;
    }
    if (this.chart == null) {
      this.chart = new Chart("bandwidthChartV2", {
        type: 'line',
        options: {
          animation: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 20,
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return value + "mb/s";
                },
              }
            }]
          }
          , tooltips: {
            callbacks: {
              label: function (tooltipItems, data) {
                var index = tooltipItems.index;
                var riskcolor = data.datasets[0].pointBackgroundColor[index];
                var riskcolor = riskcolor.toLowerCase();
                var risk = "";
                if (riskcolor == "#4eab7e") {
                  risk = "Low: " + data.datasets[0].data[index].toString()
                }
                else if (riskcolor == "#ff8400") {
                  risk = "Medium: " + data.datasets[0].data[index].toString()
                }
                else if (riskcolor == "#ff9eb5") {
                  risk = "High: " + data.datasets[0].data[index].toString()
                }
                else if (riskcolor == "#d44343") {
                  risk = "Very High: " + data.datasets[0].data[index].toString()
                }
                else if (riskcolor == "#0072ff") {
                  risk = "Training in Progress"
                }
                return risk;
              }
            }
          }
        }
      })
      var dateArray: Array<string> = new Array<string>();
      var timeMap = information.get("Time")
      timeMap.forEach(element => {
        var date = element.get("Time")
        dateArray.push(date);
      });
      if (dontUpdateLabel == false) {
        // console.log("DOES THIS EVEN RUN ==============")
        this.chart.data.labels = dateArray
      }
      this.chart.data.datasets = [{ label: 'Bandwidth Utilization', data: information.get("usage"), backgroundColor: "#1a1a1a", pointBackgroundColor: information.get("PointColor"), pointRadius: radius }]
      this.chart.update();

    }
    else {
      var dateArray: Array<string> = new Array<string>();
      var timeMap = information.get("Time")
      timeMap.forEach(element => {
        var date = element.get("Time")
        dateArray.push(date);
      });
      if (dontUpdateLabel == false) {
        // console.log("DOES THIS EVEN RUN ==============")
        this.chart.data.labels = dateArray
      }
      this.chart.data.datasets = [{ label: 'Bandwidth Utilization', data: information.get("usage"), backgroundColor: "#1a1a1a", pointBackgroundColor: information.get("PointColor"), pointRadius: radius }]
      // if(type != "live")
      // {
      //   this.chart.options.animation = true;
      // }
      // else {
      //   this.chart.options.animation = false;
      // }
      this.chart.update();

    }
  }

  getUsageData(bwData: Array<Bandwidth>) {
    var dataMap: Map<string, any> = new Map<string, any>();
    var usageArray: Array<string> = new Array<string>();
    var riskScore: Array<string> = new Array<string>();
    var time: Array<Map<string, any>> = new Array<Map<string, any>>();
    var backgroundColor: Array<string> = new Array<string>();
    bwData.forEach(data => {
      usageArray.push(data.$usage)
      riskScore.push(data.$riskScore);
      var day = this.getDayFromDate(data.$time)
      var date = data.$time.getDate();
      var month = data.$time.getMonth() + 1;
      var year = data.$time.getFullYear();
      var hour = data.$time.getHours();
      var t = data.$time.getMinutes();
      var sec = data.$time.getSeconds();
      var timeMap: Map<string, string> = new Map<string, string>();
      timeMap.set("Day", day);
      timeMap.set("DateAct", date.toString());
      timeMap.set("Date", data.$time.getDate() + "/" + month + " " + hour + ":" + t);
      timeMap.set("Month", month.toString());
      timeMap.set("Year", year.toString());
      timeMap.set("Time", hour.toString() + ":" + t.toString() + ":" + sec)
      timeMap.set("Hour", hour.toString());
      timeMap.set("Min", t.toString())
      timeMap.set("Sec", sec.toString())
      time.push(timeMap)
      var color = this.getPointColorBasedOnStatus(data.$riskScore);
      backgroundColor.push(color);
    });
    dataMap.set("usage", usageArray)
    dataMap.set("risk", riskScore)
    dataMap.set("Time", time)
    dataMap.set("PointColor", backgroundColor)
    return dataMap;
  }

  getPointColorBasedOnStatus(riskScore) {
    if (riskScore.toLowerCase() == "low") {
      return "#4EAB7E"
    }
    else if (riskScore.toLowerCase() == "medium") {
      return "#FF8400"
    }

    else if (riskScore.toLowerCase() == "high") {
      return "#ff9eb5"

    }
    else if (riskScore.toLowerCase() == "training") {
      return "#0072FF"
    }
    else {
      return "#D44343"
    }

  }

  getDayFromDate(time: Date) {
    var day = time.getDay();
    if (day == 0) {
      return "Mon"
    }
    else if (day == 1) {
      return "Tue"
    }
    else if (day == 2) {
      return "Wed"
    }
    else if (day == 3) {
      return "Thur"
    }
    else if (day == 4) {
      return "Fri"
    }
    else if (day == 5) {
      return "Sat"
    }
    else if (day == 6) {
      return "Sun"
    }
  }

  showBandwidthDetails() {
    console.log("Show Bandwidth Details")
    // this.analyticsService.DetailStatus("bwd");

  }

  showAll() {
    this.filterLive = false;
    this.filterDay = false;
    this.filterWeek = false;
    this.filterAll = true;
    this.updateCurrentInformation(this.bwData, "all");

  }

  showLive() {
    this.filterAll = false;
    this.filterDay = false;
    this.filterWeek = false;
    this.filterLive = true;
    this.updateCurrentInformation(this.bwData, "live");
  }

  showDay() {
    this.filterAll = false;
    this.filterDay = true;
    this.filterWeek = false;
    this.filterLive = false;
    this.updateCurrentInformation(this.bwData, "day");
  }

  showWeek() {

  }


  ngOnChanges() {
    // var currentBw = this.getCurrentBwBasedOnData(this.input);
    // this.chart = this.updateCurrentBandwidth(currentBw, this.input)
  }

  setColour(overviewStatus) {
    this.lowTrue = false;
    this.mediumTrue = false;
    this.highTrue = false;
    this.trainingTrue = false;

    if (overviewStatus.toLowerCase() == "low") {
      this.lowTrue = true;
      this.informationMessage = "Low Risk"
    }
    if (overviewStatus.toLowerCase() == "medium") {
      this.mediumTrue = true;
      this.informationMessage = "Medium Risk"

    } if (overviewStatus.toLowerCase() == "high") {
      // console.log("does this happen")
      this.highTrue = true;
      this.informationMessage = "High Risk"

    }
    if (overviewStatus.toLowerCase() == "very high") {
      this.veryhighTrue = true;
      this.informationMessage = "Very High Risk"

    }
    if (overviewStatus.toLowerCase() == "training") {
      this.trainingTrue = true;
      this.informationMessage = "Data is being trained"

    }
  }

  getCurrentBwBasedOnData(num: number) {
    if (num <= this.lowTo) {
      return "Low"
    }
    else if (num <= this.mediumTo) {
      return "Medium"
    }
    else if (num <= this.highTo) {
      return "High"
    }
    else {
      return null
    }
  }

  processDetailsData(clickedbw, unfilteredSelectedData, type) {

    var comday = clickedbw.$time.getDate().toString() + "/" + clickedbw.$time.getMonth().toString() + "/" + clickedbw.$time.getFullYear();
    var comhour = clickedbw.$time.getHours();
    console.log("The current day is " + comday)
    // console.log(comhour)
    // console.log(this.indBwData);
    this.indBwData.forEach(data => {
      var day = data.$time.getDate().toString() + "/" + data.$time.getMonth().toString() + "/" + data.$time.getFullYear();
      var hour = data.$time.getHours()
      if (type == "all") {
        unfilteredSelectedData.push(data);
      }
      else {
        if (day == comday) {
          if (type == "live") {
            if (hour == comhour) {
              unfilteredSelectedData.push(data);
            }
          }
          if (type == "day") {
            unfilteredSelectedData.push(data);
          }
        }
      }
    })
    var dataMapping: Map<string, Array<Indivdualbandwidth>> = new Map<string, Array<Indivdualbandwidth>>();
    unfilteredSelectedData.forEach(data => {
      if (dataMapping.get(data.$hostname)) {
        var list: Array<Indivdualbandwidth> = dataMapping.get(data.$hostname);
        list.push(data);
        dataMapping.set(data.$hostname, list);
      }
      else {
        var newArray: Array<Indivdualbandwidth> = new Array<Indivdualbandwidth>();
        newArray.push(data);
        dataMapping.set(data.$hostname, newArray)
      }

    })
    var sunormoonstart = "pm"
    var sunormoonend = "pm"
    if (comhour <= 12) {
      sunormoonstart = "am"
    }
    if (comhour + 1 < 12) {
      sunormoonend = "am"
    }
    if (type == "live") {
      this.detailsText = comday + " from " + comhour + ":00 " + sunormoonstart + " to " + (comhour + 1).toString() + ":00 " + sunormoonend
    }
    if (type == "day") {
      this.detailsText = "Showing data on " + comday;
    }
    if (type == "all") {
      this.detailsText = "Showing all data";
    }
    this.comday = comday;
    this.comhour = comhour;
    // console.log(dataMapping);
    this.selectedData = new Array<any>();
    dataMapping.forEach((value, key) => {
      // console.log(key + "Chwxk rhias");
      this.selectedData.push([key, comday, comhour, type]);
    })
    // console.log(this.selectedData);
    this.showDrilledData = true;
    try {
      document.getElementById("drilledData").scrollIntoView({ behavior: "smooth" })
    }
    catch{
      console.log("oops");
    }
    return this.selectedData;
  }




  bandwidthClick(evt) {
    var unfilteredSelectedData: Array<Indivdualbandwidth> = new Array<Indivdualbandwidth>();
    var activePoints = this.chart.getElementsAtEvent(evt);
    var index = activePoints[0]._index;
    var clickedbw: Bandwidth = this.bwData[index];
    // console.log(clickedbw);
    if (this.filterLive) {
      this.processDetailsData(clickedbw, unfilteredSelectedData, "live")

    }
    if (this.filterDay) {
      this.processDetailsData(clickedbw, unfilteredSelectedData, "day")

    }

    if (this.filterAll) {
      this.processDetailsData(clickedbw, unfilteredSelectedData, "all")

    }

  }

}


// Chart.pluginService.register({
//   beforeInit: function (chart) {
//       var hasWrappedTicks = chart.config.data.labels.some(function (label) {
//           return label.indexOf('\n') !== -1;
//       });

//       if (hasWrappedTicks) {
//           // figure out how many lines we need - use fontsize as the height of one line
//           var tickFontSize = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].ticks.fontSize, Chart.defaults.global.defaultFontSize);
//           var maxLines = chart.config.data.labels.reduce(function (maxLines, label) {
//               return Math.max(maxLines, label.split('\n').length);
//           }, 0);
//           var height = (tickFontSize + 2) * maxLines + (chart.options.scales.xAxes[0].ticks.padding || 0);

//           // insert a dummy box at the bottom - to reserve space for the labels
//           Chart.layoutService.addBox(chart, {
//               draw: Chart.helpers.noop,
//               isHorizontal: function () {
//                   return true;
//               },
//               update: function () {
//                   return {
//                       height: this.height
//                   };
//               },
//               height: height,
//               options: {
//                   position: 'bottom',
//                   fullWidth: 1,
//               }
//           });

//           // turn off x axis ticks since we are managing it ourselves
//           chart.options = Chart.helpers.configMerge(chart.options, {
//               scales: {
//                   xAxes: [{
//                       ticks: {
//                           display: false,
//                           // set the fontSize to 0 so that extra labels are not forced on the right side
//                           fontSize: 0
//                       }
//                   }]
//               }
//           });

//           chart.hasWrappedTicks = {
//               tickFontSize: tickFontSize
//           };
//       }
//   },
//   afterDraw: function (chart) {
//       if (chart.hasWrappedTicks) {
//           // draw the labels and we are done!
//           chart.chart.ctx.save();
//           var tickFontSize = chart.hasWrappedTicks.tickFontSize;
//           var tickFontStyle = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
//           var tickFontFamily = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
//           var tickLabelFont = Chart.helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
//           chart.chart.ctx.font = tickLabelFont;
//           chart.chart.ctx.textAlign = 'center';
//           var tickFontColor = Chart.helpers.getValueOrDefault(chart.options.scales.xAxes[0].fontColor, Chart.defaults.global.defaultFontColor);
//           chart.chart.ctx.fillStyle = tickFontColor;

//           var meta = chart.getDatasetMeta(0);
//           var xScale = chart.scales[meta.xAxisID];
//           var yScale = chart.scales[meta.yAxisID];

//           chart.config.data.labels.forEach(function (label, i) {
//               label.split('\n').forEach(function (line, j) {
//                   chart.chart.ctx.fillText(line, xScale.getPixelForTick(i + 0.5), (chart.options.scales.xAxes[0].ticks.padding || 0) + yScale.getPixelForValue(yScale.min) +
//                       // move j lines down
//                       j * (chart.hasWrappedTicks.tickFontSize + 2));
//               });
//           });

//           chart.chart.ctx.restore();
//       }
//   }
// });



    // if (this.currentUser == null) {
    //   var allUser: Array<User> = new Array<User>();
    //   this.userService.getUsers().subscribe(data => {
    //     for (var i = 0; i < data.length; i++) {
    //       var newUser = this.userService.convertUser(data[i]);
    //       allUser.push(newUser)
    //     }
    //   });
    //   var returnValue;
    //   this.userService.getUserDocumentID().subscribe(data => {
    //     for (var i = 0; i < data.length; i++) {
    //       if (data[i].payload.doc.id == "KJfWYi34fjRBxl1wDMru") {
    //         returnValue = allUser[i];
    //         returnValue.$documentID = data[i].payload.doc.id
    //         this.currentUser = returnValue;
    //         console.log(this.currentUser)
    //       }
    //     }
    //   });

    // }
    // console.log(this.currentUser);





    // console.log(this.currentUser.$organizationId)

    //readFromDatabase


    // if(this.currentUser == null)
    // {
    //   this.userService.getUserById("testing2").subscribe( i => {
    //    console.log
    // })


    // if(this.currentUser != null)
    // {

    //   var currentSetting = this.currentUser.$bandwidthSetting;
    //   if(currentSetting == "string")
    //   {
    //     console.log("testing");
    //     this.currentUser.$bandwidthSetting =  this.lowFrom + "," + this.lowTo + "," + this.mediumFrom + "," + this.mediumTo + "," + this.highFrom + "," + this.highTo
    //     console.log("testing");

    //   }
    //   else {
    //       var currentSetArray = currentSetting.split(",")
    //       this.lowFrom = Number.parseInt(currentSetArray[0])
    //       this.lowTo = Number.parseInt(currentSetArray[1])
    //       this.mediumFrom = Number.parseInt(currentSetArray[2])
    //       this.mediumTo = Number.parseInt(currentSetArray[3])
    //       this.highFrom = Number.parseInt(currentSetArray[4])
    //       this.highTo = Number.parseInt(currentSetArray[5])
    //   }
    //   var currentBw = this.getCurrentBwBasedOnData(this.input);
    //   this.setCurrentBandwidth(currentBw, this.input);
    // }
    // else {
    //   this.currentUser =  await this.webApi.getUser("string1"); 
    //   var currentSetting = this.currentUser.$bandwidthSetting;
    //   if(currentSetting == "string")
    //   {
    //     console.log("testing");
    //     this.currentUser.$bandwidthSetting =  this.lowFrom + "," + this.lowTo + "," + this.mediumFrom + "," + this.mediumTo + "," + this.highFrom + "," + this.highTo
    //     console.log("testing");

    //   }
    //   else {
    //       var currentSetArray = currentSetting.split(",")
    //       this.lowFrom = Number.parseInt(currentSetArray[0])
    //       this.lowTo = Number.parseInt(currentSetArray[1])
    //       this.mediumFrom = Number.parseInt(currentSetArray[2])
    //       this.mediumTo = Number.parseInt(currentSetArray[3])
    //       this.highFrom = Number.parseInt(currentSetArray[4])
    //       this.highTo = Number.parseInt(currentSetArray[5])
    //   }
    //   var currentBw = this.getCurrentBwBasedOnData(this.input);
    //   this.setCurrentBandwidth(currentBw, this.input);
    // }

//   closeSetting() {
//     this.settings = false;
//   }

//   submitSettings() {

//     var value1 = this.lowTo - this.lowFrom
//     var value2 = this.mediumTo - this.mediumFrom + 1
//     var value3 = this.highTo - this.highFrom + 1
//     var total = value1 + value2 + value3;

//     if (this.lowTo >= 0 && this.lowTo <= 100
//       && this.lowFrom >= 0 && this.lowFrom <= 100
//       && this.mediumTo >= 0 && this.mediumTo <= 100
//       && this.mediumFrom >= 0 && this.mediumFrom <= 100
//       && this.highTo >= 0 && this.highTo <= 100
//       && this.highFrom >= 0 && this.highFrom <= 100
//     ) {
//       if (total == 100) {

//         if (this.lowFrom < this.lowTo && this.lowTo < this.mediumFrom && this.mediumFrom < this.mediumTo && this.mediumTo < this.highFrom && this.highFrom < this.highTo) {
//           this.error = false;
//           this.errorMessage = "";
//           this.lowThreshold = this.lowTo;
//           this.mediumThreshold = this.mediumTo;
//           this.highTreshold - this.highTo;

//           var Setting: Array<any> = new Array<any>();

//           this.currentUser.$bandwidthSetting = this.lowFrom + "," + this.lowTo + "," + this.mediumFrom + "," + this.mediumTo + "," + this.highFrom + "," + this.highTo
//           this.webApi.updateUser(this.currentUser.$userId, this.currentUser);
//           var currentBw = this.getCurrentBwBasedOnData(this.input);
//           this.chart = this.updateCurrentBandwidth(currentBw, this.input);
//           this.settings = false;

//         }
//         else {
//           this.errorMessage = "Values are incorrect"
//           this.error = true;
//         }
//       }
//       else {
//         this.errorMessage = "Values do not add up to 100%"
//         this.error = true;
//       }
//     }
//     else {
//       this.errorMessage = "Values must be within 0 - 100"
//       this.error = true;
//     }


//   }
//   testing() {
//     console.log(this.lowFrom + "-" + this.lowTo);
//     console.log(this.mediumFrom + "-" + this.mediumTo)
//     console.log(this.highFrom + "-" + this.highTo)
//     //this.setSettingChart(this.lowFrom , this.lowTo , this.mediumFrom , this.mediumTo , this.highFrom , this.highTo);


//   }

//   getSettingData(lowStart, lowEnd, mediumStart, mediumEnd, highStart, highEnd) {
//     var dataList: Array<any> = new Array<any>();
//     var labelList: Array<string> = new Array<string>();
//     var lowData = lowEnd - lowStart;
//     var mediumData = mediumEnd - mediumStart;
//     var highData = highEnd - highStart;


//     dataList.push(lowEnd);
//     labelList.push("Low")
//     dataList.push(mediumEnd);
//     labelList.push("Medium")
//     dataList.push(highEnd);
//     labelList.push("High")

//     return [dataList, labelList]
//   }


//   // setSettingChart(lowStart , lowEnd, mediumStart, mediumEnd, highStart, highEnd)
//   // {
//   //   var data = this.getSettingData(lowStart, lowEnd, mediumStart, mediumEnd, highStart, highEnd);
//   //   if(this.settingChart == null)
//   //   {
//   //     console.log("is this working")
//   //     this.settingChart = new Chart("newChart" , {
//   //       type: 'doughnut',
//   //       data: {
//   //         datasets: [{
//   //           data: data[0],
//   //           backgroundColor:["#4EAB7E","#FF8400" , "#D44343" ]
//   //        }],
//   //        labels: data[1]

//   //       },
//   //       options : {
//   //         responsive: true,
//   //         maintainAspectRatio: true,

//   //       }
//   //     })
//   //   } 
//   //   else {
//   //     this.settingChart.data.datasets = [{
//   //       data: data[0],
//   //       backgroundColor:["#4EAB7E","#FF8400" , "#D44343" ]
//   //    }],
//   //     this.settingChart.data.labels = data[1]
//   //     this.settingChart.update();
//   //   }

//   // }

//   flip() {
//     this.settings = (this.settings == false) ? true : false;
//     console.log(this.settings);
//     console.log(this.chart)
//     if (this.settings == true) {
//       console.log("testing")
//       //this.setSettingChart(this.lowFrom , this.lowTo , this.mediumFrom , this.mediumTo , this.highFrom , this.highTo);
//       //var currentBw = this.getCurrentBwBasedOnData(39);
//       //var currentBw = "Low"
//       //var data = 39;
//       //this.setCurrentBandwidth(currentBw ,  data);


//     }
//   }
//   setCurrentBandwidth(bandwidth: string, currentPercentage: number) {
//     this.bandwidth = bandwidth
//     this.data = currentPercentage.toString() + "%"
//     var leftover = 100 - currentPercentage;
//     this.dataset = this.getCurrentDatasetForBandwidth(leftover, currentPercentage)
//     this.chart = this.createChart(this.dataset, bandwidth.toLowerCase())
//   }

//   updateCurrentBandwidth(bandwidth: string, currentPercentage: number) {
//     this.bandwidth = bandwidth
//     this.data = currentPercentage.toString() + "%"
//     var leftover = 100 - currentPercentage;
//     this.dataset = this.getCurrentDatasetForBandwidth(leftover, currentPercentage)
//     console.log(this.dataset)
//     this.chart = this.updateChart(this.dataset, bandwidth.toLowerCase())
//     return this.chart;
//   }
//   getCurrentDatasetForBandwidth(leftover: number, current: number) {
//     var dataset: Array<any> = new Array<any>();
//     dataset.push(current)
//     dataset.push(leftover)
//     return dataset;
//   }

//   createChart(data: any, riskLevel) {
//     var color = ""
//     if (riskLevel.toLowerCase() == "high") {
//       color = "#D44343"
//     }
//     else if (riskLevel.toLowerCase() == "medium") {
//       color = "#FF8400"
//     }
//     else if (riskLevel.toLowerCase() == "low") {
//       color = "#4EAB7E"
//     }

//     var options = this.chartOptions(riskLevel.toLowerCase(), color);

//     console.log("this happens");
//     console.log(this.chart);
//     this.chart = new Chart("bandwidthChart", {
//       type: 'doughnut',
//       data: {
//         datasets: [{
//           data: data,
//           backgroundColor: [color, "#A9A9A9"]
//         }],
//         labels: [
//           'Usage',
//           'Remainder'
//         ]

//       },
//       options: options
//     })
//     return this.chart;


//   }

//   updateChart(data: any, riskLevel) {
//     console.log(data);
//     var color = ""
//     if (riskLevel.toLowerCase() == "high") {
//       color = "#D44343"
//     }
//     else if (riskLevel.toLowerCase() == "medium") {
//       color = "#FF8400"
//     }
//     else if (riskLevel.toLowerCase() == "low") {
//       color = "#4EAB7E"
//     }
//     console.log("does this happens");
//     console.log(this.chart);
//     this.chart.data.datasets = [{ data: data, backgroundColor: [color, "#A9A9A9"] }]
//     this.chart.options = this.chartOptions(riskLevel.toLowerCase(), color);
//     this.chart.update();
//     return this.chart;
//   }


//   chartOptions(riskLevel, color) {
//     var options = {
//       responsive: true,
//       maintainAspectRatio: true,
//       segmentShowStroke: false,
//       legend: {
//         display: false
//       },
//       elements: {
//         center: {
//           text: riskLevel.substring(0, 1).toUpperCase() + riskLevel.substring(1),
//           color: color, //Default black
//           fontStyle: 'Helvetica', //Default Arial
//           sidePadding: 40 //Default 20 (as a percentage)

//         },
//         arc: {
//           borderWidth: 3,
//           borderColor: "#1a1a1a"
//         }
//       },
//       tooltips: {
//         callbacks: {
//           label: function (tooltipItem, chartData) {
//             var currentIndex = tooltipItem.index;
//             var currentData = ""
//             console.log(chartData);
//             chartData.datasets.forEach(element => {
//               currentData = element.data[currentIndex] + "%" + chartData.labels[currentIndex]
//             });
//             return currentData
//           }
//         }
//       }
//     }
//     return options;
//   }
// }



// Chart.pluginService.register({
//   beforeDraw: function (chart) {
//     if (chart.config.options.elements.center) {
//       //Get ctx from string
//       var ctx = chart.chart.ctx;

//       //Get options from the center object in options
//       var centerConfig = chart.config.options.elements.center;
//       var fontStyle = centerConfig.fontStyle || 'Arial';
//       var txt = centerConfig.text;
//       var color = centerConfig.color || '#000';
//       var sidePadding = centerConfig.sidePadding || 20;
//       var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
//       //Start with a base font of 30px
//       ctx.font = "30px " + fontStyle;

//       //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
//       var stringWidth = ctx.measureText(txt).width;
//       var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

//       // Find out how much the font can grow in width.
//       var widthRatio = elementWidth / stringWidth;
//       var newFontSize = Math.floor(30 * widthRatio);
//       var elementHeight = (chart.innerRadius * 2);

//       // Pick a new font size so it will not be larger than the height of label.
//       var fontSizeToUse = Math.min(newFontSize, elementHeight);

//       //Set font settings to draw it correctly.
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
//       var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
//       ctx.font = fontSizeToUse + "px " + fontStyle;
//       ctx.fillStyle = color;

//       //Draw text in center
//       ctx.fillText(txt, centerX, centerY);
//     }
//   }