export class CpuClass {
    private x: string; 
    private y: string;
    private r: number; 


	constructor($x: string, $y: string, $r: number) {
		this.x = $x;
		this.y = $y;
		this.r = $r;
	}

    /**
     * Getter $x
     * @return {string}
     */
	public get $x(): string {
		return this.x;
	}

    /**
     * Setter $x
     * @param {string} value
     */
	public set $x(value: string) {
		this.x = value;
	}

    /**
     * Getter $y
     * @return {string}
     */
	public get $y(): string {
		return this.y;
	}

    /**
     * Setter $y
     * @param {string} value
     */
	public set $y(value: string) {
		this.y = value;
	}

    /**
     * Getter $r
     * @return {number}
     */
	public get $r(): number {
		return this.r;
	}

    /**
     * Setter $r
     * @param {number} value
     */
	public set $r(value: number) {
		this.r = value;
	}
    
}
