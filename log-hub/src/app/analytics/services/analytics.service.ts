import { Injectable,EventEmitter } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private detailsStatus = new BehaviorSubject<Boolean>(false);
  public currentDetails = this.detailsStatus.asObservable();

  constructor() { }

  DetailStatus(value:Boolean)
  {
    this.detailsStatus.next(value);
  }




}
