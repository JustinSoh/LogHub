export class Organization {
    private organizationId: string;
    private organizationName: string;

	constructor($organizationId: string, $organizationName: string) {
        this.organizationId = $organizationId;
        this.organizationName = $organizationName;
	}
    
    /**
     * Getter $orgId
     * @return {string}
     */
	public get $organizationId(): string {
		return this.organizationId
	}

    /**
     * Setter $orgId
     * @param {string} value
     */
	public set $organizationId(value: string) {
		this.organizationId = value;
	}


    /**
     * Getter $orgname
     * @return {string}
     */
	public get $organizationName(): string {
		return this.organizationName;
	}

    /**
     * Setter $orgname
     * @param {string} value
     */
	public set $organizationName(value: string) {
		this.organizationName = value;
	}
}
