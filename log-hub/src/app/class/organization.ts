export class Organization {
    private organizationId: string;
    private organizationName: string;
    private securePinCode: string;
    public selected:boolean;


	constructor($organizationId: string, $organizationName: string, $securePinCode: string) {
		this.organizationId = $organizationId;
		this.organizationName = $organizationName;
		this.securePinCode = $securePinCode;
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
     * Getter $organizationName
     * @return {string}
     */
	public get $organizationName(): string {
		return this.organizationName;
	}

    /**
     * Setter $organizationName
     * @param {string} value
     */
	public set $organizationName(value: string) {
		this.organizationName = value;
	}

    /**
     * Getter $securePinCode
     * @return {number}
     */
	public get $securePinCode(): string {
		return this.securePinCode;
	}

    /**
     * Setter $securePinCode
     * @param {number} value
     */
	public set $securePinCode(value: string) {
		this.securePinCode = value;
	}

}
