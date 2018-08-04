import { Component, OnInit, OnChanges } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { BandwidthService } from '../../../services/bandwidth.service';
import { Bandwidth } from '../../../class/bandwidth';
import { WebapiService } from '../../../services/webapi.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { User } from '../../../class/user';

@Component({
  selector: 'app-details-template',
  templateUrl: './details-template.component.html',
  styleUrls: ['./details-template.component.css']
})
export class DetailsTemplateComponent implements OnInit , OnChanges {
  private as:AnalyticsService
  private bandwidthData:Array<Bandwidth>;
  private bandwidthService:BandwidthService; 
  private webApi:WebapiService
  private routing:Router;
  private currentUser:User;
  private showBandwidth:Boolean = false ;
  constructor(ass:AnalyticsService , bandwidthService:BandwidthService , webApi:WebapiService , routing:Router) { 
    this.as = ass;
    this.bandwidthService = bandwidthService;
    this.webApi = webApi;
    this.routing = routing
  }

  processShowWhat(data:String)
  {
    var result:String = "none"
    if(data.toLowerCase() == "bwd")
    {
      result = "bandwidth";
    }
    return result;
  }

  ngOnChanges() {
    this.as.currentDetails.subscribe(data => {
      console.log(data);
    });
  }

  async ngOnInit() {

    //Check if current is bandwidth 
    await this.as.currentDetails.subscribe(data => {
      console.log(data);
      // var showWhat = this.processShowWhat(data)
      // console.log(showWhat)
      if(data == "bwd")
      {
        console.log("testing");
        this.showBandwidth = true;
      }
      else {
        this.showBandwidth = false;
      }
    })
    
    // if(this.showBandwidth == true)
    // {
    //   console.log("does thsi work")
    //   this.webApi.user.subscribe(data => {
    //     if(data == null)
    //     {
    //       this.routing.navigate(["/"])
    //     }
    //     else {
    //        this.currentUser = data;
    //        this.bandwidthService.getBandwidthBasedOnId(this.currentUser.$organizationId).valueChanges().subscribe(data => {
    //          console.log(data);
    //        })
    //      }
    //  });
    // }
    // else {
    //   console.log("what the fuck")
    // }
    
  };

}
