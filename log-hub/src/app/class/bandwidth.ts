export class Bandwidth {
    private bandwidthId: string;
    private included: string; 
    private time: Date;
    private usage: string; 
    private riskScore: string;


	constructor($bandwidthId: string, $included: string, $time: Date, $usage: string, $riskScore: string) {
        this.bandwidthId = $bandwidthId;
        this.included = $included;
        this.time = $time;
        this.usage = $usage;
        this.riskScore = $riskScore;
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
     * Getter $included
     * @return {string}
     */
	public get $included(): string {
		return this.included;
	}

    /**
     * Setter $included
     * @param {string} value
     */
	public set $included(value: string) {
		this.included = value;
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
     * Getter $riskScore
     * @return {string}
     */
	public get $riskScore():string {
		return this.riskScore;
	}

    /**
     * Setter $riskScore
     * @param {string} value
     */
	public set $riskScore(value: string) {
		this.riskScore = value;
	}





}
