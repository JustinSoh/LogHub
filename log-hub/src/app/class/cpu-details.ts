export class CpuDetails {
    private chromeAverage: number;
    private chromeTotal: number;
    private chromeUsage: number;
    private cpuAverage: number;
    private cpuCount: number;
    private desc1: string;
    private desc2: string;
    private desc3: string;
    private ev1: string;
    private ev2: string;
    private ev3: string;
    private orgId: string;


    constructor($chromeAverage: number, $chromeTotal: number, $chromeUsage: number, $cpuAverage: number, $cpuCount: number, $desc1: string, $desc2: string, $desc3: string, $ev1: string, $ev2: string, $ev3: string, $orgId: string) {
        this.chromeAverage = $chromeAverage;
        this.chromeTotal = $chromeTotal;
        this.chromeUsage = $chromeUsage;
        this.cpuAverage = $cpuAverage;
        this.cpuCount = $cpuCount;
        this.desc1 = $desc1;
        this.desc2 = $desc2; this.desc3 = $desc3;
        this.ev1 = $ev1;
        this.ev2 = $ev2;
        this.ev3 = $ev3;
        this.orgId = $orgId;
    }


    /** 
     * Getter $chromeAverage 
     * @return {number} 
     */
    public get $chromeAverage(): number {
        return this.chromeAverage;
    }

    /** 
     * Setter $chromeAverage 
     * @param {number} value 
     */
    public set $chromeAverage(value: number) {
        this.chromeAverage = value;
    }
    /** 
     * Getter $chromeTotal 
     * @return {number} 
     */
    public get $chromeTotal(): number {
        return this.chromeTotal;
    }

    /** 
     * Setter $chromeTotal 
     * @param {number} value 
     */
    public set $chromeTotal(value: number) {
        this.chromeTotal = value;
    }

    /** 
     * Getter $chromeUsage 
     * @return {number} 
     */
    public get $chromeUsage(): number {
        return this.chromeUsage;
    }
    /** 
     * Setter $chromeUsage 
     * @param {number} value 
     */
    public set $included(value: number) {
        this.chromeUsage = value;
    }

    /** 
     * Getter $cpuAverage 
     * @return {number} 
     */
    public get $cpuAverage(): number {
        return this.cpuAverage;
    }

    /** 
     * Setter $cpuAverage 
     * @param {number} value 
     */
    public set $cpuAverage(value: number) {
        this.cpuAverage = value;
    }

    /** 
     * Getter $cpuCount 
     * @return {number} 
     */
    public get $cpuCount(): number {
        return this.cpuCount;
    }

    /** 
     * Setter $cpuCount 
     * @param {number} value 
     */
    public set $cpuCount(value: number) {
        this.cpuCount = value;
    }

    /** 
     * Getter $desc1 
     * @return {string} 
     */
    public get $desc1(): string {
        return this.desc1;
    }

    /** 
     * Setter $desc1 
     * @param {string} value 
     */
    public set $desc1(value: string) {
        this.desc1 = value;
    }

    /** 
     * Getter $desc2 
     * @return {string} 
     */
    public get $desc2(): string {
        return this.desc2;
    }

    /** 
     * Setter $desc2 
     * @param {string} value 
     */
    public set $desc2(value: string) {
        this.desc2 = value;
    }

    /** 
    * Getter $desc3 
    * @return {string} 
    */
    public get $desc3(): string {
        return this.desc3;
    }

    /** 
     * Setter $desc3 
     * @param {string} value 
     */
    public set $desc3(value: string) {
        this.desc3 = value;
    }


    /** 
     * Getter $ev1 
     * @return {string} 
     */
    public get $ev1(): string {
        return this.ev1;
    }

    /** 
     * Setter $ev1 
     * @param {string} value 
     */
    public set $ev1(value: string) {
        this.ev1 = value;
    }

    /** 
         * Getter $ev2 
         * @return {string} 
         */
    public get $ev2(): string {
        return this.ev2;
    }

    /** 
     * Setter $ev2 
     * @param {string} value 
     */
    public set $ev2(value: string) {
        this.ev2 = value;
    }

    /** 
         * Getter $ev3 
         * @return {string} 
         */
    public get $ev3(): string {
        return this.ev3;
    }

    /** 
     * Setter $ev3 
     * @param {string} value 
     */
    public set $ev3(value: string) {
        this.ev3 = value;
    }

    /** 
         * Getter $orgId 
         * @return {string} 
         */
    public get $orgId(): string {
        return this.orgId;
    }

    /** 
     * Setter $ev3 
     * @param {string} value 
     */
    public set $orgId(value: string) {
        this.orgId = value;
    }
}

