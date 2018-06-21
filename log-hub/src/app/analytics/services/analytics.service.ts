import { Injectable,EventEmitter } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CpuClass } from '../../class/cpu-class';
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private detailsStatus = new BehaviorSubject<Boolean>(false);
  public currentDetails = this.detailsStatus.asObservable();
  private currentDataset = new BehaviorSubject<CpuClass>(null);
  public currentData = this.currentDataset.asObservable();
  private cpuLow : Array<CpuClass>;
  private cpuMedium : Array<CpuClass>;
  private cpuHigh : Array<CpuClass>;


  constructor() { }

  DetailStatus(value:Boolean)
  {
    this.detailsStatus.next(value);
  }

  DataDetails(value:CpuClass)
  {
    this.currentDataset.next(value);
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
