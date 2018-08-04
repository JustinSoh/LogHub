import { Time } from "../../../node_modules/@angular/common";

export class Indivdualbandwidth {
    private indBwId: string;
    private hostname:string;
    private organizationId: string; 
    private time:Date;
    private download:number; 
    private upload:number; 

	constructor($indBwId: string, $hostname: string, $organizationId: string, $time: Date, $download: number, $upload: number) {
		this.indBwId = $indBwId;
		this.hostname = $hostname;
		this.organizationId = $organizationId;
		this.time = $time;
		this.download = $download;
		this.upload = $upload;
	}


    /**
     * Getter $indBwId
     * @return {string}
     */
	public get $indBwId(): string {
		return this.indBwId;
	}

    /**
     * Setter $indBwId
     * @param {string} value
     */
	public set $indBwId(value: string) {
		this.indBwId = value;
	}


    /**
     * Getter $hostname
     * @return {string}
     */
	public get $hostname(): string {
		return this.hostname;
	}

    /**
     * Setter $hostname
     * @param {string} value
     */
	public set $hostname(value: string) {
		this.hostname = value;
	}


    /**
     * Getter $organizationId
     * @return {string}
     */
	public get $organizationId(): string {
		return this.organizationId;
	}

    /**
     * Setter $organizationId
     * @param {string} value
     */
	public set $organizationId(value: string) {
		this.organizationId = value;
	}

    /**
     * Getter $time
     * @return {Time}
     */
	public get $time(): Date {
		return this.time;
	}

    /**
     * Setter $time
     * @param {Time} value
     */
	public set $time(value: Date) {
		this.time = value;
	}


    /**
     * Getter $download
     * @return {number}
     */
	public get $download(): number {
		return this.download;
	}

    /**
     * Setter $download
     * @param {number} value
     */
	public set $download(value: number) {
		this.download = value;
	}

    /**
     * Getter $upload
     * @return {number}
     */
	public get $upload(): number {
		return this.upload;
	}

    /**
     * Setter $upload
     * @param {number} value
     */
	public set $upload(value: number) {
		this.upload = value;
	}

}
