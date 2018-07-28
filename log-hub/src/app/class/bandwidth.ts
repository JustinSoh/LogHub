export class Bandwidth {
    private bandwidthId: string;
    private hostId: string;
    private included: Boolean; 
    private organizationId: string; 
    private riskScore: string;
    private time: Date;
    private usage: string; 
    private processed: Boolean


	constructor($bandwidthId: string, $hostId: string, $included: Boolean, $organizationId: string, $riskScore: string, $time: Date, $usage: string , $processed:Boolean) {
		this.bandwidthId = $bandwidthId;
		this.hostId = $hostId;
		this.included = $included;
		this.organizationId = $organizationId;
		this.riskScore = $riskScore;
		this.time = $time;
        this.usage = $usage;
        this.processed = $processed
	}


    /**
     * Getter $bandwidthId
     * @return {string}
     */
	public get $bandwidthId(): string {
		return this.bandwidthId;
	}

    /**
     * Setter $bandwidthId
     * @param {string} value
     */
	public set $bandwidthId(value: string) {
		this.bandwidthId = value;
	}

    /**
     * Getter $hostId
     * @return {string}
     */
	public get $hostId(): string {
		return this.hostId;
	}

    /**
     * Setter $hostId
     * @param {string} value
     */
	public set $hostId(value: string) {
		this.hostId = value;
	}

    /**
     * Getter $included
     * @return {Boolean}
     */
	public get $included(): Boolean {
		return this.included;
	}

    /**
     * Setter $included
     * @param {Boolean} value
     */
	public set $included(value: Boolean) {
		this.included = value;
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
     * Getter $riskScore
     * @return {string}
     */
	public get $riskScore(): string {
		return this.riskScore;
	}

    /**
     * Setter $riskScore
     * @param {string} value
     */
	public set $riskScore(value: string) {
		this.riskScore = value;
	}

    /**
     * Getter $time
     * @return {Date}
     */
	public get $time(): Date {
		return this.time;
	}

    /**
     * Setter $time
     * @param {Date} value
     */
	public set $time(value: Date) {
		this.time = value;
	}

    /**
     * Getter $usage
     * @return {string}
     */
	public get $usage(): string {
		return this.usage;
	}

    /**
     * Setter $usage
     * @param {string} value
     */
	public set $usage(value: string) {
		this.usage = value;
    }
    
     /**
     * Getter $process
     * @return {Boolean}
     */
	public get $processed(): Boolean {
		return this.processed;
	}

    /**
     * Setter $usage
     * @param {Boolean} value
     */
	public set $processed(value: Boolean) {
		this.processed = value;
	}
    





}
