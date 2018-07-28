export class User {
    private userId: string;
    private password: string; 
    private organizationId: string;
    private email: string; 
    private bandwidthSetting:string;
    private documentID:string;

	constructor($userId: string, $password: string, $organizationId: string, $email: string, $bandwidthSetting: string) {
		this.userId = $userId;
		this.password = $password;
		this.organizationId = $organizationId;
		this.email = $email;
		this.bandwidthSetting = $bandwidthSetting;
	}
    

    /**
     * Getter $userId
     * @return {string}
     */
	public get $userId(): string {
		return this.userId;
	}

    /**
     * Setter $userId
     * @param {string} value
     */
	public set $userId(value: string) {
		this.userId = value;
	}


    /**
     * Getter $password
     * @return {string}
     */
	public get $password(): string {
		return this.password;
	}

    /**
     * Setter $password
     * @param {string} value
     */
	public set $password(value: string) {
		this.password = value;
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
     * Getter $email
     * @return {string}
     */
	public get $email(): string {
		return this.email;
	}

    /**
     * Setter $email
     * @param {string} value
     */
	public set $email(value: string) {
		this.email = value;
    }
    

    /**
     * Getter $bandwidthSetting
     * @return {Array<any>}
     */
	public get $bandwidthSetting():string {
		return this.bandwidthSetting;
	}

    /**
     * Setter $bandwidthSetting
     * @param {Array<any>} value
     */
	public set $bandwidthSetting(value: string) {
		this.bandwidthSetting = value;
	}


    /**
     * Getter $documentID
     * @return {string}
     */
	public get $documentID(): string {
		return this.documentID;
	}

    /**
     * Setter $documentID
     * @param {string} value
     */
	public set $documentID(value: string) {
		this.documentID = value;
	}
    




}
