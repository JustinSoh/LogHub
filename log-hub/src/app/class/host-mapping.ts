export class HostMapping {
    private DefaultGateway:string; 
    private Hostname:string;
    private IPAddress:string; 
    private MACAddress:string; 
    private OrganizationID:string;


	constructor($DefaultGateway: string, $Hostname: string, $IPAddress: string, $MACAddress: string, $OrganizationID: string) {
		this.DefaultGateway = $DefaultGateway;
		this.Hostname = $Hostname;
		this.IPAddress = $IPAddress;
		this.MACAddress = $MACAddress;
		this.OrganizationID = $OrganizationID;
	}


    /**
     * Getter $DefaultGateway
     * @return {string}
     */
	public get $DefaultGateway(): string {
		return this.DefaultGateway;
	}

    /**
     * Setter $DefaultGateway
     * @param {string} value
     */
	public set $DefaultGateway(value: string) {
		this.DefaultGateway = value;
	}
    

    /**
     * Getter $Hostname
     * @return {string}
     */
	public get $Hostname(): string {
		return this.Hostname;
	}

    /**
     * Setter $Hostname
     * @param {string} value
     */
	public set $Hostname(value: string) {
		this.Hostname = value;
	}

    /**
     * Getter $IPAddress
     * @return {string}
     */
	public get $IPAddress(): string {
		return this.IPAddress;
	}

    /**
     * Setter $IPAddress
     * @param {string} value
     */
	public set $IPAddress(value: string) {
		this.IPAddress = value;
	}

    /**
     * Getter $MACAddress
     * @return {string}
     */
	public get $MACAddress(): string {
		return this.MACAddress;
	}

    /**
     * Setter $MACAddress
     * @param {string} value
     */
	public set $MACAddress(value: string) {
		this.MACAddress = value;
	}

    /**
     * Getter $OrganizationID
     * @return {string}
     */
	public get $OrganizationID(): string {
		return this.OrganizationID;
	}

    /**
     * Setter $OrganizationID
     * @param {string} value
     */
	public set $OrganizationID(value: string) {
		this.OrganizationID = value;
	}

}
