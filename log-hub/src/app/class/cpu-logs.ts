export class CpuLogs {
    private date: string;
    private hostname: string;
    private logId: number;
    private organizationId: string;
    private riskValue: string;
    private testData: Boolean;
    private time: string;
    private usage: number;


    constructor($date: string, $hostname: string, $logId: number, $organizationId: string, $riskValue: string, $testData: Boolean, $time: string, $usage: number) {
        this.date = $date;
        this.hostname = $hostname;
        this.logId = $logId;
        this.organizationId = $organizationId;
        this.riskValue = $riskValue;
        this.testData = $testData;
        this.time = $time;
        this.usage = $usage
    }
    /** 
     * Getter $date 
     * @return {string} 
     */
    public get $date(): string {
        return this.date;
    }

    /** 
     * Setter $date 
     * @param {string} value 
     */
    public set $date(value: string) {
        this.date = value;
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
     * Getter $logId 
     * @return {number} 
     */
    public get $logId(): number {
        return this.logId;
    }

    /** 
     * Setter $logId 
     * @param {number} value 
     */
    public set $logId(value: number) {
        this.logId = value;
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
     * Getter $riskValue 
     * @return {string} 
     */
    public get $riskValue(): string {
        return this.riskValue;
    }

    /** 
     * Setter $riskValue 
     * @param {string} value 
     */
    public set $riskValue(value: string) {
        this.riskValue = value;
    }

    /** 
     * Getter $testData 
     * @return {Boolean} 
     */
    public get $testData(): Boolean {
        return this.testData;
    }

    /** 
     * Setter $testData 
     * @param {Boolean} value 
     */
    public set $testData(value: Boolean) {
        this.testData = value;
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
    * @return {number} 
    */
    public get $usage(): number {
        return this.usage;
    }

    /** 
    * Setter $usage 
    * @param {number} value 
    */
    public set $usage(value: number) {
        this.usage = value;
    }


}