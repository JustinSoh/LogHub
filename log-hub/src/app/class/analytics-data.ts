export class AnalyticsData {
    private organizationTotalBandwidth: Number; 

    constructor(organizationTotalBandwidth)
    {
        this.organizationTotalBandwidth = organizationTotalBandwidth
    }


    /**
     * Getter $organizationTotalBandwidth
     * @return {Number}
     */
	public get $organizationTotalBandwidth(): Number {
		return this.organizationTotalBandwidth;
	}

    /**
     * Setter $organizationTotalBandwidth
     * @param {Number} value
     */
	public set $organizationTotalBandwidth(value: Number) {
		this.organizationTotalBandwidth = value;
	}
    

}
