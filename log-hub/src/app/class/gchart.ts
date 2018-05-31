export class Gchart {

    private cpuOverviewData:any;
    private cpuOverviewLabel:Array<String>;
    private cpuOverviewType:String; 

	constructor(cpuOverviewData, cpuOverviewLabel , cpuOverviewType) {
        this.cpuOverviewData = cpuOverviewData; 
        this.cpuOverviewLabel = cpuOverviewLabel;
        this.cpuOverviewType = cpuOverviewType;
    }
    
    /**
     * Getter $cpuOverviewData
     * @return {any}
     */
	public get $cpuOverviewData(): any {
		return this.cpuOverviewData;
	}

    /**
     * Setter $cpuOverviewData
     * @param {any} value
     */
	public set $cpuOverviewData(value: any) {
		this.cpuOverviewData = value;
    }
    

    /**
     * Getter $cpuOverviewLabel
     * @return {Array<String>}
     */
	public get $cpuOverviewLabel(): Array<String> {
		return this.cpuOverviewLabel;
	}

    /**
     * Setter $cpuOverviewLabel
     * @param {Array<String>} value
     */
	public set $cpuOverviewLabel(value: Array<String>) {
		this.cpuOverviewLabel = value;
	}

    /**
     * Getter $cpuOverviewType
     * @return {String}
     */
	public get $cpuOverviewType(): String {
		return this.cpuOverviewType;
	}

    /**
     * Setter $cpuOverviewType
     * @param {String} value
     */
	public set $cpuOverviewType(value: String) {
		this.cpuOverviewType = value;
	}
    

}
