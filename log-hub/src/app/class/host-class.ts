export class HostClass {
    private hostId: string; 
    private cpuData: any;
    private predictedArray: Array<number>;
    private actualArray: Array<number>; 



	constructor($hostId: string, $cpuData: any, $predictedArray: Array<number>, $actualArray: Array<number>) {
		this.hostId = $hostId;
		this.cpuData = $cpuData;
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
