import { Component, OnInit, Input } from '@angular/core';
import { HostmappingService } from '../../services/hostmapping.service';
import { HostMapping } from '../../class/host-mapping';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../class/organization';
import { IndividualbandwidthService } from '../../services/individualbandwidth.service';
import { Indivdualbandwidth } from '../../class/indivdualbandwidth';
import { Chart } from 'node_modules/chart.js';

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
  private filterSec:Boolean = true; 
  private filterMin:Boolean = false; 
  private filterDaily:Boolean = false;
  constructor(hostMapping:HostmappingService , organizatioNService:OrganizationService , indBWService:IndividualbandwidthService ) { 
    this.hostMapService = hostMapping;
    this.organizationService = organizatioNService;
    this.individualBandwidthService = indBWService;

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
          this.createChart(this.allIndBWData , this.type , this.comday , this.comhour);
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
    this.createChart(this.allIndBWData , this.type , this.comday , this.comhour);
  }

  showMinutes(){
    this.filterSec = false; 
    this.filterMin = true;
    this.filterDaily = false;
    this.type = this.getCurrentType();
    this.createChart(this.allIndBWData , this.type , this.comday , this.comhour);
  }

  showDaily(){
    this.filterSec = false; 
    this.filterMin = false;
    this.filterDaily = true;
    this.type = this.getCurrentType();
    this.createChart(this.allIndBWData , this.type , this.comday , this.comhour);
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

  createChart(allIndBWData:Array<Indivdualbandwidth> , type , comday , comhour) 
  {
    var time:Array<Map<string , any>> = new Array<Map<string, any>>();
    var labels:Array<string>= new Array<string>();
    var uploadFirst:Array<number> = new Array<number>();
    var downloadFirst:Array<number> = new Array<number>();
    var downloadDataset:Array<number> = new Array<number>(); 
    var uploadDataset:Array<number> = new Array<number>();
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
    // if (type == "all")
    // {
    //   var counter = 0;
    //   for(var i = 0; i < time.length; i = i + 100)
    //   {
    //     // var uploadTotal = 0; 
    //     // for(var a = counter; a <= i ; a++ )
    //     // {
    //     //   uploadTotal = uploadTotal + uploadFirst[a];
    //     // }
    //     // var downloadTotal = 0; 
    //     // for(var a = counter; a <= i ; a++ )
    //     // {
    //     //   downloadTotal = downloadTotal + downloadFirst[a];
    //     // }

    //     var uploadTotal = 0; 
    //     for(var a = counter; a <= i ; a++ )
    //     {
    //       uploadTotal = uploadTotal + uploadFirst[a];
    //     }
    //     var downloadTotal = 0; 
    //     for(var a = counter; a <= i ; a++ )
    //     {
    //       downloadTotal = downloadTotal + downloadFirst[a];
    //     }
    //     uploadDataset.push(uploadTotal);
    //     downloadDataset.push(downloadTotal);

    //     labels.push(time[i].get('DateAct') + "/" + time[i].get('Month') + "/" + time[i].get('Year'))
    //     counter = i; 
    //   }
    //   var uploadRemainderTotal = 0;
    //   var downloadRemainderTotal = 0;
    //   if(counter != time.length-1)
    //   {
    //     if(counter != 0)
    //     {
    //       for(var i = counter; i < time.length; i++)
    //       {
    //         uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
    //         downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
    //       }
  
    //       uploadDataset.push(uploadRemainderTotal);
    //       downloadDataset.push(downloadRemainderTotal);
    //       labels.push(time[time.length-1].get('Date') )
    //     }
       
    //   }

    //   if(counter == 0)
    //   {
    //     uploadDataset = new Array<any>();
    //     downloadDataset = new Array<any>();
    //     for(var i = 0; i < time.length; i++)
    //     {
    //       uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
    //       downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
    //     }

    //     uploadDataset.push(uploadRemainderTotal);
    //     downloadDataset.push(downloadRemainderTotal);
    //     labels.push(time[time.length-1].get('Date') )
    //   }
    //   console.log(uploadDataset);
    //   console.log(downloadDataset);
    //   // if(this.chart != null)
    //   // {
    //   //   console.log("is this happening")
    //   //    this.chart.options.scales.yAxes.ticks.stepSize = 1000;
    //   // }
    //   labelHeader = "Upload Usage (Daily) "
    //   downloadHeader = "Download Usage (Daily)"

    // }
    console.log(type);
    if(type =="all")
    {
      console.log(type + "does thsi run");

      var counter = 0;
      for(var i = 0; i < time.length; i = i + 86400)
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
          labels.push(time[time.length-1].get('Date') )
        }

        // if(counter != 0)
        //     {
        //       for(var i = counter; i < time.length; i++)
        //       {
        //         uploadRemainderTotal = uploadRemainderTotal + uploadFirst[i];
        //         downloadRemainderTotal = downloadRemainderTotal + downloadFirst[i];
        //       }
      
        //       uploadDataset.push(uploadRemainderTotal);
        //       downloadDataset.push(downloadRemainderTotal);
        //       labels.push(time[time.length-1].get('Date') )
        //     }
      }
     
      labelHeader = "Upload Usage (Daily )"
      downloadHeader = "Download Usage (Daily)"

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
          labels.push(time[time.length-1].get('Date') )
        }
       
      }
     
      labelHeader = "Upload Usage (10 Minutes)"
      downloadHeader = "Download Usage (10 Minutes)"
     
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
          labels.push(time[time.length-1].get('Min') + ":" + time[time.length-1].get('Sec'))
        }
       

      }
    

      labelHeader = "Upload Usage " + comday + " from " + comhour + ":00 to " + (Number(comhour)+1).toString() + ":00 (10 secs Interval)"
      downloadHeader = "Download Usage " + comday + " from " + comhour + ":00 to " + (Number(comhour)+1).toString() + ":00 (10 secs Interval)"
      
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
          type: 'bar',
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
     
    
    
    this.chart.data.labels = labels;
    this.chart.data.datasets = [
    { label: labelHeader, data: uploadDataset, backgroundColor: "#FF8400", pointBackgroundColor: ["#0042ff"], pointRadius: 5 } , 
    { label: downloadHeader, data: downloadDataset, backgroundColor: "#4EAB7E", pointBackgroundColor: ["#4EAB7E"], pointRadius: 5 }];
    this.chart.update();
  }

}
