import { Injectable,EventEmitter } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CpuClass } from '../../class/cpu-class';
import { HostClass } from 'src/app/class/host-class';
import { Bandwidth } from '../../class/bandwidth';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  //To set boolean to show bandwidth details
  private detailsStatus = new BehaviorSubject<String>(null);
  public currentDetails = this.detailsStatus.asObservable();
  
  //To set currentDataset
  private bwDataset = new BehaviorSubject<Array<Bandwidth>>(null);
  public bwData = this.bwDataset.asObservable();

  //To show the host portion
  private hostStatus = new BehaviorSubject<Boolean>(false);
  public currentHost = this.hostStatus.asObservable();

  //To get the hostData 
  private hostData = new BehaviorSubject<HostClass>(null);
  public currentHostData = this.hostData.asObservable();

  private cpuLow : Array<CpuClass>;
  private cpuMedium : Array<CpuClass>;
  private cpuHigh : Array<CpuClass>;


  constructor() { }

  DetailStatus(value:String)
  {
    this.detailsStatus.next(value);
  }

  BwDataDetails(value:Array<Bandwidth>)
  {
    this.bwDataset.next(value);
  }

  HostDetails(value:Boolean)
  {
    this.hostStatus.next(value);
  }

  HostData(value:HostClass)
  {
    this.hostData.next(value);
  }


    /**
     * Getter $cpuLow
     * @return {Array<CpuClass>}
     */
	public get $cpuLow(): Array<CpuClass> {
		return this.cpuLow;
	}

    /**
     * Setter $cpuLow
     * @param {Array<CpuClass>} value
     */
	public set $cpuLow(value: Array<CpuClass>) {
		this.cpuLow = value;
	}

    /**
     * Getter $cpuMedium
     * @return {Array<CpuClass>}
     */
	public get $cpuMedium(): Array<CpuClass> {
		return this.cpuMedium;
	}

    /**
     * Setter $cpuMedium
     * @param {Array<CpuClass>} value
     */
	public set $cpuMedium(value: Array<CpuClass>) {
		this.cpuMedium = value;
	}

    /**
     * Getter $cpuHigh
     * @return {Array<CpuClass>}
     */
	public get $cpuHigh(): Array<CpuClass> {
		return this.cpuHigh;
	}

    /**
     * Setter $cpuHigh
     * @param {Array<CpuClass>} value
     */
	public set $cpuHigh(value: Array<CpuClass>) {
		this.cpuHigh = value;
	}




  




}
