import { Component, OnInit, Input } from '@angular/core';
import { HostmappingService } from '../../services/hostmapping.service';
import { HostMapping } from '../../class/host-mapping';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../class/organization';
import { IndividualbandwidthService } from '../../services/individualbandwidth.service';
import { Indivdualbandwidth } from '../../class/indivdualbandwidth';
import { Chart } from 'node_modules/chart.js';
import { FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { WebapiService } from '../../services/webapi.service';
import { User } from '../../class/user';

@Component({
  selector: 'app-host-details',
  templateUrl: './host-details.component.html',
  styleUrls: ['./host-details.component.css']
})
export class HostDetailsComponent implements OnInit {
  @Input() data:any;
  private hostMapService:HostmappingService;
  private currentHM:HostMapping;
  private hostName:string;
  private IPAddress:string; 
  private MACAddress:string; 
  private DefaultGateway:string; 
  private organizationService:OrganizationService;
  private individualBandwidthService:IndividualbandwidthService;
  private organizationName:string;
  private allIndBWData:Array<Indivdualbandwidth> = new Array<Indivdualbandwidth>();
  private upload:string; 
  private download:string; 
  private total:string;
  private type:string;
  private comday:string; 
  private comhour:string;
  private chart:any;
  private thresholdChart:any;
  private thresholdRange;

  private filterSec:Boolean = true; 
  private filterMin:Boolean = false; 
  private filterDaily:Boolean = false;
  private webApiService:WebapiService;
  private currentUser:User;
  private thresholdLevelMessage:Number = 0;
  private thresholdLevelEndMessage:Number = 0;

  private warningLevelMessage:string = "Warning Message"
  constructor(hostMapping:HostmappingService , organizatioNService:OrganizationService , indBWService:IndividualbandwidthService , webApiService:WebapiService ) { 
    this.hostMapService = hostMapping;
    this.organizationService = organizatioNService;
    this.individualBandwidthService = indBWService;
    this.webApiService = webApiService;

  }
  getCurrentType()
  {
    if(this.filterSec == true)
    {
      return "live"
    }
    if(this.filterMin == true)
    {
      return "day"
    }
    if(this.filterDaily == true)
    {
      return "all";
    }
  }
  ngOnInit() {
    // console.log(this.data);
    this.hostName = this.data[0];
    this.type = this.getCurrentType();
    this.comday = this.data[2];
    this.comhour = this.data[3];
    // console.log(this.type) 
    console.log(this.data[0]);
    
    this.hostMapService.getSpecificHostBasedOnID(this.data[0]).subscribe(data =>
    {
      this.webApiService.user.subscribe(testing => {
      this.currentUser = testing;
      console.log(data)
      data.forEach(data1 => {
        this.currentHM = this.hostMapService.convertToHostMapObj(data1);
      })
      console.log(this.currentHM);
      this.IPAddress = this.currentHM.$IPAddress;
      console.log(this.IPAddress);
      this.MACAddress = this.currentHM.$MACAddress
      this.DefaultGateway = this.currentHM.$DefaultGateway;
      var organization:Organization;
      this.organizationService.getOrgsObjUsingID(this.currentHM.$OrganizationID).subscribe(data => {
        data.forEach(element => {
          organization = this.organizationService.convertOrg(element);
        });
        this.organizationName = organization.$organizationName;
      })
      var bandwidthDocID:Array<string> = new Array<string>();
      this.individualBandwidthService.getBandwidthIDBasedOnHostname(this.hostName).subscribe(data => {
        data.forEach(element => {
         bandwidthDocID.push((element['payload']['doc']['id']))
        })     
        this.allIndBWData = new Array<Indivdualbandwidth>();  
        // console.log(this.allIndBWData.length.toString() + "xhxfasd");
        
        this.individualBandwidthService.getBandwidthBasedOnHostname(this.hostName).subscribe(data2 => {
          this.allIndBWData = new Array<Indivdualbandwidth>();  
          this.upload = ""; 
          this.download = ""; 
          this.total = "";
          var upload = 0; 
          var download = 0; 
          var total = 0;
          for(var i = 0; i < data2.length; i++)
          {
            var docId = bandwidthDocID[i]
            var indBVw = this.individualBandwidthService.convertIndBandwidthFromData(docId ,data2[i]);
            var day = indBVw.$time.getDate().toString() + "/" + indBVw.$time.getMonth().toString() + "/" + indBVw.$time.getFullYear();
            var hour = indBVw.$time.getHours()
            if(this.type == "all")
            {
              this.allIndBWData.push(indBVw);
            }
            if(this.type == "live")
            {
              if (day == this.comday) 
              {
                if (hour.toString() == this.comhour)
                {
                  this.allIndBWData.push(indBVw);
                }
              }
            }
            if(this.type == "day")
            {
              if (day == this.comday) 
              {
                this.allIndBWData.push(indBVw);
              }
            }
          }
          this.allIndBWData = this.sortInformation(this.allIndBWData);
          var newInformation = this.allIndBWData.sort((a: any, b: any) =>
            (a.time).getTime() - new Date(b.time).getTime()
          );
          // console.log(this.allIndBWData.length.toString() + "cccccc") ;
          // this.allIndBWData = new Array<Indivdualbandwidth>(); 
          // this.allIndBWData = newInformation;
          this.allIndBWData.forEach(data => {
            upload = upload + data.$upload;
            download = download + data.$download;
            total = total + data.$upload + data.$download
          })
        
          this.upload = upload.toString(); 
          this.download = download.toString();
          this.total = total.toString();
          console.log(this.type)
          this.individualBandwidthService.getSpecificThreshold(this.currentUser.$userId , this.currentHM.$Hostname).valueChanges().subscribe(
            data => {
              data.forEach(thresh => {
                this.thresholdLevelMessage = Number(thresh['thresholdLevel']);
                this.thresholdLevelEndMessage = Number(thresh['thresholdLevelEnd'])
                this.thresholdRange = Number(thresh['thresholdLevel']).toString() + " - " +  Number(thresh['thresholdLevelEnd']).toString();

                this.warningLevelMessage = thresh['warningMessage'];
              })
            }
          )
          this.createChart(this.allIndBWData , this.type , this.comday , this.comhour , this.thresholdLevelMessage);
          // this.thresholdChart = new Chart('individualBandwidthChart' , {
          //   type: 'line'
          // })
          // this.thresholdChart.data.labels = ['threshold']
          // this.thresholdChart.data.datasets = [{label: "Threshold" , data: 100}]
         
        })
      })
    })
  
     

    })
  }
  showSeconds() 
  {
    this.filterSec = true; 
    this.filterMin = false;
    this.filterDaily = false;
    this.type = this.getCurrentType();
    this.createChart(this.allIndBWData , this.type , this.comday , this.comhour,  this.thresholdLevel);
  }

  showMinutes(){
    this.filterSec = false; 
    this.filterMin = true;
    this.filterDaily = false;
    this.type = this.getCurrentType();
    this.createChart(this.allIndBWData , this.type , this.comday , this.comhour,  this.thresholdLevel);
  }

  showDaily(){
    this.filterSec = false; 
    this.filterMin = false;
    this.filterDaily = true;
    this.type = this.getCurrentType();
    this.createChart(this.allIndBWData , this.type , this.comday , this.comhour , this.thresholdLevel);
  }
  sortInformation(information) {
    // console.log(information.length)
    var information2 = information.sort((a: any, b: any) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    // console.log(information2)
    return information2

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

  createChart(allIndBWData:Array<Indivdualbandwidth> , type , comday , comhour , thresholdLevelMessagee) 
  {
    this.individualBandwidthService.getSpecificThreshold(this.currentUser.$userId , this.currentHM.$Hostname).valueChanges().subscribe(data => {
      var thresholdLevelMessage = 0; 
      var thresholdLevelEndMessage = 0;
      data.forEach(tres => {
        thresholdLevelMessage = tres['thresholdLevel']
        thresholdLevelEndMessage = tres['thresholdLevelEnd']
      })
      var time:Array<Map<string , any>> = new Array<Map<string, any>>();
      var labels:Array<string>= new Array<string>();
      var uploadFirst:Array<number> = new Array<number>();
      var downloadFirst:Array<number> = new Array<number>();
      var downloadDataset:Array<number> = new Array<number>(); 
      var uploadDataset:Array<number> = new Array<number>();
      var threshold:Array<number> = new Array<number>();
      var thresholdEnd:Array<number> = new Array<number>();
      var stepSizeLabel;
      allIndBWData.forEach(data => {
        var day = this.getDayFromDate(data.$time)
        var date = data.$time.getDate();
        var month = data.$time.getMonth() + 1;
        var year = data.$time.getFullYear();
        var hour = data.$time.getHours();
        var t = data.$time.getMinutes();
        var sec = data.$time.getSeconds();
        var timeMap: Map<string, any> = new Map<string, any>();
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
        uploadFirst.push(data.$upload);
        downloadFirst.push(data.$download);
      })
      var labelHeader = ""
      var downloadHeader = ""
      var thresholdHeader = ""
     
      console.log(type);
      if(type =="all")
      {
        console.log(type + "does thsi run");
  
        var counter = 0;
        for(var i = 0; i < time.length; i = i + 3600)
        {
          var uploadTotal = 0; 
          for(var a = counter; a <= i ; a++ )
          {
            uploadTotal = uploadTotal + uploadFirst[a];
          }
          var downloadTotal = 0; 
          for(var a = counter; a <= i ; a++ )
          {
            downloadTotal = downloadTotal + downloadFirst[a];
          }
          uploadDataset.push(uploadTotal);
          downloadDataset.push(downloadTotal);
          threshold.push(thresholdLevelMessage)
          thresholdEnd.push(thresholdLevelEndMessage)

          labels.push(time[i].get('Date'))
          counter = i; 
        }
        var uploadRemainderTotal = 0;
        var downloadRemainderTotal = 0;
        if(counter != time.length-1)
        {
          if(counter == 0)
          {
            for(var i = counter; i < time.length; i++)
            {
              uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
              downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
            }
      
            uploadDataset.push(uploadRemainderTotal);
            downloadDataset.push(downloadRemainderTotal);
            threshold.push(thresholdLevelMessage)
            thresholdEnd.push(thresholdLevelEndMessage)
            labels.push(time[time.length-1].get('Date') )
          }
  
          if(counter != 0)
              {
                for(var i = counter; i < time.length; i++)
                {
                  uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
                  downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
                }
        
                uploadDataset.push(uploadRemainderTotal);
                downloadDataset.push(downloadRemainderTotal);
                threshold.push(thresholdLevelMessage)
                thresholdEnd.push(thresholdLevelEndMessage)
                labels.push(time[time.length-1].get('Date') )
              }
        }
       
        labelHeader = "Upload Usage (Hourly)"
        downloadHeader = "Download Usage (Hourly)"
        thresholdHeader = "Threshold";
      }
  
      if(type == "day")
      {
        var counter = 0;
  
        
        for(var i = 0; i < time.length; i = i + 600)
        {
          var uploadTotal = 0; 
          for(var a = counter; a <= i ; a++ )
          {
            uploadTotal = uploadTotal + uploadFirst[a];
          }
          var downloadTotal = 0; 
          for(var a = counter; a <= i ; a++ )
          {
            downloadTotal = downloadTotal + downloadFirst[a];
          }
          uploadDataset.push(uploadTotal);
          downloadDataset.push(downloadTotal);
          threshold.push(thresholdLevelMessage)
          thresholdEnd.push(thresholdLevelEndMessage)

          labels.push(time[i].get('Date'))
          counter = i; 
        }
        var uploadRemainderTotal = 0;
        var downloadRemainderTotal = 0;
        if(counter != time.length-1)
        {
          if(counter == 0)
          {
            for(var i = counter; i < time.length; i++)
            {
              uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
              downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
            }
      
            uploadDataset.push(uploadRemainderTotal);
            downloadDataset.push(downloadRemainderTotal);
            threshold.push(thresholdLevelMessage)
            thresholdEnd.push(thresholdLevelEndMessage)
            

            labels.push(time[time.length-1].get('Date') )
          }
         
        }
       
        labelHeader = "Upload Usage (10 Minutes)"
        downloadHeader = "Download Usage (10 Minutes)"
        thresholdHeader = "Threshold";

       
      }
  
      if (type == "live")
      {
        var counter = 0;
       
        for(var i = 0; i < time.length; i = i + 10)
        {
          var uploadTotal = 0; 
          for(var a = counter; a <= i ; a++ )
          {
            uploadTotal = uploadTotal + uploadFirst[a];
          }
          var downloadTotal = 0; 
          for(var a = counter; a <= i ; a++ )
          {
            downloadTotal = downloadTotal + downloadFirst[a];
          }
          uploadDataset.push(uploadTotal);
          downloadDataset.push(downloadTotal);
          threshold.push(thresholdLevelMessage)
          thresholdEnd.push(thresholdLevelEndMessage)

  
          labels.push(time[i].get('Min') + ":" + time[i].get('Sec'))
          counter = i; 
        }
        var uploadRemainderTotal = 0;
        var downloadRemainderTotal = 0;
      
  
        if(counter != time.length-1)
        {
          if(counter == 0)
          {
            for(var i = counter; i < time.length; i++)
            {
              uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
              downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
            }
            uploadDataset.push(uploadRemainderTotal);
            downloadDataset.push(downloadRemainderTotal);
            threshold.push(thresholdLevelMessage)
            thresholdEnd.push(thresholdLevelEndMessage)

            labels.push(time[time.length-1].get('Min') + ":" + time[time.length-1].get('Sec'))
          }
         
  
        }
      
  
        labelHeader = "Upload Usage " + comday + " from " + comhour + ":00 to " + (Number(comhour)+1).toString() + ":00 (10 secs Interval)"
        downloadHeader = "Download Usage " + comday + " from " + comhour + ":00 to " + (Number(comhour)+1).toString() + ":00 (10 secs Interval)"
        thresholdHeader = "Threshold";
      }
  
      
      // console.log(labels);
      // console.log(type);
      // console.log(type + "check thois");
      stepSizeLabel = 10;
      
  
      if(type == "live")
      {
        stepSizeLabel = 10;
        
      }
      if(type == "all")
      {
        stepSizeLabel = 10000;
      }
      if(type == "day")
      {
        stepSizeLabel = 1000;
      }
      if(this.chart == null)
        {
        
          this.chart = new Chart('individualBandwidthChart', {
            type: 'line',
            options: {
              animation: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    stepSize: stepSizeLabel,
                    // Include a dollar sign in the ticks
                  }
                }]
              }
            }
          })
        }
      console.log(thresholdLevelMessage);
      this.chart.options.scales.yAxes= [{ticks: { beginAtZero:true , stepSize: stepSizeLabel}}];
      this.chart.data.labels = labels;
      this.chart.data.datasets = [{ label: thresholdHeader, data: thresholdEnd, backgroundColor: '#fafafa', borderColor:'#fafafa' , fill:false ,  pointBackgroundColor: "#fafafa", pointRadius: 0 } ,
      { label: thresholdHeader, data: threshold, backgroundColor: '#fafafa', borderColor:'#fafafa' , fill:false ,  pointBackgroundColor: "#fafafa", pointRadius: 0 } , 
      { label: labelHeader, data: uploadDataset, backgroundColor: "#FF8400", pointBackgroundColor: "#777777", pointRadius: 2 } , 
      { label: downloadHeader, data: downloadDataset, backgroundColor: "#4EAB7E", pointBackgroundColor: "#777777", pointRadius: 2 }];
      this.chart.update();
    })
  }
  private threshold = false; 
  private thresholdLevel = new FormControl('', [Validators.required]);
  private thresholdLevelEnd = new FormControl('', [Validators.required]);
  
  private warningMessage = new FormControl('', [Validators.required]);
  showThreshold()
  {
    console.log("Is thsi working");
    this.threshold = true;
  }

  thresholdMethod()
  {
    console.log(this.thresholdLevel.value)
    console.log("Threshold method")
  }

  warningMessageMethod()
  {
    console.log(this.warningMessage.value)
    console.log("Warning message")
  }

  confirm()
  {
    if(this.thresholdLevel.valid && this.warningMessage.valid && this.thresholdLevelEnd.valid)
    {
      var arrayOfId:Array<string> = new Array<string>();
      this.individualBandwidthService.getThresholdID().subscribe(uidp => {
        uidp.forEach(data => {
          arrayOfId.push(data['payload']['doc']['id']);
          
        })
      })
     console.log(arrayOfId);
     this.individualBandwidthService.getThresholdLevel(this.currentUser.$userId , this.currentHM.$Hostname , this.currentHM.$OrganizationID , this.thresholdLevel.value , this.warningMessage.value).subscribe(
       data => {
         for (var i = 0; i < data.length; i++)
         {
          if(this.currentUser.$userId == data[i]['UserID'] && this.currentHM.$Hostname == data[i]['TargetHostName'] && this.currentHM.$OrganizationID == data[i]['organizationId'] )
            {
              this.individualBandwidthService.updateThresholdLevel(arrayOfId[i],this.currentUser.$userId , this.currentHM.$Hostname , this.currentHM.$OrganizationID , this.thresholdLevel.value, this.warningMessage.value , this.thresholdLevelEnd.value);
            }
          else
          {
            this.individualBandwidthService.setThresholdLevel(this.currentUser.$userId , this.currentHM.$Hostname , this.currentHM.$OrganizationID , this.thresholdLevel.value, this.warningMessage.value , this.thresholdLevelEnd.value);
          }
         }
        
       }
     )
    }
    console.log(this.thresholdLevel.value)
    console.log(this.warningMessage.value)
    console.log("Confirm")
    this.threshold = false;
  }

  cancel()
  {
    this.threshold = false;
    console.log("Cancel")
  }

}
