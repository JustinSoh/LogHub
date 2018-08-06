import { Component, OnInit, ElementRef } from '@angular/core';
import { WebapiService } from '../services/webapi.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private webApi:WebapiService
  private elementRef: ElementRef

  
  constructor(webApi:WebapiService, elementRef:ElementRef) {
    this.webApi = webApi
    this.elementRef = elementRef
   }

  ngOnInit() {
    $(document).ready(function() {
      setTimeout(function() {
        $("#main").removeClass("is-loading");
      }, 100)
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#212121';
  }

}
