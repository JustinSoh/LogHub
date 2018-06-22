export class HostClass {
    private hostId: string; 
    private cpuData: any;
    private cpuRiskLevel: string;
    private predictedArray: Array<number>;
    private actualArray: Array<number>; 

    //Low = 0.0, Medium = 5.0 , High = 10.0 (X Value)
    //6 = Browser , 5 = Game , 4 = Word Processing , 3 = Database , 2 = Spreadsheet , 1 = Multimedia
    //Cpu risk level is the level of the risk in a particular category 


	constructor($hostId: string, $cpuData: any, $cpuRiskLevel: string, $predictedArray: Array<number>, $actualArray: Array<number>) {
		this.hostId = $hostId;
		this.cpuData = $cpuData;
		this.cpuRiskLevel = $cpuRiskLevel;
		this.predictedArray = $predictedArray;
		this.actualArray = $actualArray;
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
     * Getter $cpuData
     * @return {any}
     */
	public get $cpuData(): any {
		return this.cpuData;
	}

    /**
     * Setter $cpuData
     * @param {any} value
     */
	public set $cpuData(value: any) {
		this.cpuData = value;
	}

    /**
     * Getter $cpuRiskLevel
     * @return {string}
     */
	public get $cpuRiskLevel(): string {
		return this.cpuRiskLevel;
	}

    /**
     * Setter $cpuRiskLevel
     * @param {string} value
     */
	public set $cpuRiskLevel(value: string) {
		this.cpuRiskLevel = value;
	}

    /**
     * Getter $predictedArray
     * @return {Array<number>}
     */
	public get $predictedArray(): Array<number> {
		return this.predictedArray;
	}

    /**
     * Setter $predictedArray
     * @param {Array<number>} value
     */
	public set $predictedArray(value: Array<number>) {
		this.predictedArray = value;
	}

    /**
     * Getter $actualArray
     * @return {Array<number>}
     */
	public get $actualArray(): Array<number> {
		return this.actualArray;
	}

    /**
     * Setter $actualArray
     * @param {Array<number>} value
     */
	public set $actualArray(value: Array<number>) {
		this.actualArray = value;
	}



}
