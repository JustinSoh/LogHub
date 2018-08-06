import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { BandwidthService } from '../../services/bandwidth.service';
import { Indivdualbandwidth } from '../../class/indivdualbandwidth';
import { IndividualbandwidthService } from '../../services/individualbandwidth.service';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../class/organization';

@Component({
  selector: 'app-bandwidth-details',
  templateUrl: './bandwidth-details.component.html',
  styleUrls: ['./bandwidth-details.component.css']
})
export class BandwidthDetailsComponent implements OnInit {
  private as: AnalyticsService
  private bandwidthService: BandwidthService
  private individualBandwidth: IndividualbandwidthService;
  private indBwData: Array<Indivdualbandwidth> = new Array<Indivdualbandwidth>();
  private totalUsage: Number;
  private hostname: string;
  private organizationobj: Organization;
  private organizationName: string;
  private currentDataset: Indivdualbandwidth;
  private organizationService: OrganizationService;
  private first:Boolean = false;
  private upload:string;
  private download:string;
  private total:string;
  private action:string;
  private hostDetails:Boolean = false;;
  private hostName:any;
  private actionName:String = "Expand" ;
  constructor(as: AnalyticsService, bandwidthService: BandwidthService, indBandwidthService: IndividualbandwidthService, organizationService: OrganizationService) {
    this.as = as;
    this.bandwidthService = bandwidthService;
    this.individualBandwidth = indBandwidthService;
    this.organizationService = organizationService;
  }

  @Input() input: any;

  ngOnInit() {
    if (this.input[0] != "Hostname") {
      // console.log(this.input);
      var indBwID: Array<string> = new Array<string>();
      this.individualBandwidth.getBandwidthIDBasedOnHostname(this.input[0]).subscribe(data => {
        indBwID = new Array<string>();
        this.indBwData = new Array<Indivdualbandwidth>();
        data.forEach(element => {
          var docId = element['payload']['doc']['id'];
          indBwID.push(docId);
        });
      })
      
      this.individualBandwidth.getBandwidthBasedOnHostname(this.input[0]).subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          var indId = indBwID[i];
          var indBwObj: Indivdualbandwidth = this.individualBandwidth.convertIndBandwidthFromData(indId, data[i]);
          var day = indBwObj.$time.getDate().toString() + "/" + indBwObj.$time.getMonth().toString() + "/" + indBwObj.$time.getFullYear();
          var hour = indBwObj.$time.getHours()
          // console.log(day)
          if(this.input[3] == "all")
          {
            this.organizationName = indBwObj.$organizationId;
            // console.log(this.organizationName);
            this.indBwData.push(indBwObj)
          }
          else{
            if (day == this.input[1]) {
              if(this.input[3] == "live")
              {
                if (hour == this.input[2]) {
                  this.organizationName = indBwObj.$organizationId;
                  // console.log(this.organizationName);
                  this.indBwData.push(indBwObj)
                }
              }
              if(this.input[3] == "day")
              {
                this.organizationName = indBwObj.$organizationId;
                // console.log(this.organizationName);
                this.indBwData.push(indBwObj)
              }
            }
          }
        }
        console.log(this.organizationName)
        this.organizationService.getOrgsDocumentIDbyID(this.organizationName).subscribe(data => {
          var organizationID = ""
          // console.log(data);
          data.forEach(dat1 => {
            // console.log(dat1);
            organizationID = dat1['payload']['doc']['id'];
          })
          this.organizationService.getOrgsObjByDocID(organizationID).subscribe(data => {
            var obj = this.organizationService.convertOrg(data);
            this.organizationobj = obj;
            this.organizationName = this.organizationobj.$organizationName;
          })
        });
        this.indBwData = this.sortInformation(this.indBwData);
        var upload = 0; 
        var download = 0; 
        var total = 0;
        this.indBwData.forEach(data => {
          upload = upload + data.$upload;
          download = download + data.$download
          total = total + data.$upload + data.$download;
        })

        this.upload = upload.toString() + " MB";
        this.download = download.toString() + " MB";
        this.total = total.toString() + " MB";
        this.hostname = this.input[0];


        // console.log(this.indBwData);
      })
    }
    else {
      this.first = true;
      this.hostname = this.input[0]
      this.organizationName = this.input[1];
      this.upload = this.input[2];
      this.download = this.input[3];
      this.total = this.input[4];
      this.action = this.input[5];
    }
    //this.bandwidthService.getBandwidthBasedOnId()


  }

  sortInformation(information) {
    var information2 = information.sort((a: any, b: any) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    // console.log(information2)
    return information2

  }

  showHostDetails() {
    if(this.hostDetails == false)
    {
      this.actionName = "Collapse"
      this.hostDetails = true;
      var type = ""
      if(this.input[3] == "all")
      {
        type = "all"
      }
      if(this.input[3] == "live")
      {
        type = "live"
      }
      if(this.input[3] == "day")
      {
        type = "day"
      }
      this.hostName = [this.input[0] , type , this.input[1] , this.input[2]]
      console.log(this.hostName);
    }
    else {
      this.hostDetails = false; 
      this.actionName = "Expand";
    }
  
  }
}
