import { Component, OnInit, Input } from '@angular/core';
import { HostmappingService } from '../../services/hostmapping.service';
import { HostMapping } from '../../class/host-mapping';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../class/organization';
import { IndividualbandwidthService } from '../../services/individualbandwidth.service';
import { Indivdualbandwidth } from '../../class/indivdualbandwidth';

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
  constructor(hostMapping:HostmappingService , organizatioNService:OrganizationService , indBWService:IndividualbandwidthService ) { 
    this.hostMapService = hostMapping;
    this.organizationService = organizatioNService;
    this.individualBandwidthService = indBWService;

  }

  ngOnInit() {
    this.hostName = this.data[0];
    this.type = this.data[1];
    this.comday = this.data[2];
    this.comhour = this.data[3];
    console.log(this.type)
    this.hostMapService.getSpecificHostBasedOnID(this.data[0]).subscribe(data =>
    {
      data.forEach(data1 => {
        this.currentHM = this.hostMapService.convertToHostMapObj(data1);
      })
      this.IPAddress = this.currentHM.$IPAddress;
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
        
        this.individualBandwidthService.getBandwidthBasedOnHostname(this.hostName).subscribe(data2 => {
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
          var upload = 0; 
          var download = 0; 
          var total = 0;
          this.allIndBWData.forEach(data => {
            upload = upload + data.$upload;
            download = download + data.$download;
            total = total + data.$upload + data.$download
          })

          this.upload = upload.toString(); 
          this.download = download.toString();
          this.total = total.toString();
          
        })
      })
    
    })
  }

}
