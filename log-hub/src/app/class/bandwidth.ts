export class Bandwidth {
    private bandwidthId: string;
    private included: boolean; 
    private time: string;
    private usage: string; 
    private riskScore: number;


	constructor($bandwidthId: string, $included: boolean, $time: string, $usage: string, $riskScore: number) {
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
     * @return {boolean}
     */
	public get $included(): boolean {
		return this.included;
	}

    /**
     * Setter $included
     * @param {boolean} value
     */
	public set $included(value: boolean) {
		this.included = value;
	}

    /**
     * Getter $time
     * @return {string}
     */
	public get $time(): string {
		return this.time;
	}

    /**
     * Setter $time
     * @param {string} value
     */
	public set $time(value: string) {
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
     * @return {number}
     */
	public get $riskScore():number {
		return this.riskScore;
	}

    /**
     * Setter $riskScore
     * @param {number} value
     */
	public set $riskScore(value: number) {
		this.riskScore = value;
	}





}
