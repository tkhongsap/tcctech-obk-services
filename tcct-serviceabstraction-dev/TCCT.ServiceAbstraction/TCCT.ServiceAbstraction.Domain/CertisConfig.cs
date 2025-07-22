namespace TCCT.ServiceAbstraction.Domain;
public class CertisConfig
{
	public string EndPoint { get; set; } = null!;
	public string APIKey { get; set; } = null!;
	public string DMS { get; set; } = null!;
	public string CMS { get; set; } = null!;
	public string Core { get; set; } = null!;
	public string MainEndPoint { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;
	public string TenantHeaders { get; set; } = null!;
	public string ExternalEndPoint { get; set; } = null!;
	public string ExternalClient { get; set; } = null!;
	public string WFM { get; set; } = null!;
	public string IFM { get; set; } = null!;
	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("CERTIS_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("CERTIS_APIKEY", APIKey);
		Environment.SetEnvironmentVariable("CERTIS_DMS", DMS);
		Environment.SetEnvironmentVariable("CERTIS_CMS", CMS);
		Environment.SetEnvironmentVariable("CERTIS_CORE", Core);
		Environment.SetEnvironmentVariable("CERTIS_MAINENDPOINT", MainEndPoint);
		Environment.SetEnvironmentVariable("CERTIS_CLIENTID", ClientID);
		Environment.SetEnvironmentVariable("CERTIS_CLIENTSECRET", ClientSecret);
		Environment.SetEnvironmentVariable("CERTIS_TENANTHEADERS", TenantHeaders);
		Environment.SetEnvironmentVariable("CERTIS_EXTERNAL_ENDPOINT", ExternalEndPoint);
		Environment.SetEnvironmentVariable("CERTIS_EXTERNAL_CLIENT", ExternalClient);
		Environment.SetEnvironmentVariable("CERTIS_WFM", WFM);
		Environment.SetEnvironmentVariable("CERTIS_IFM", IFM);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("CERTIS_ENDPOINT")!;
		APIKey = Environment.GetEnvironmentVariable("CERTIS_APIKEY")!;
		DMS = Environment.GetEnvironmentVariable("CERTIS_DMS")!;
		CMS = Environment.GetEnvironmentVariable("CERTIS_CMS")!;
		Core = Environment.GetEnvironmentVariable("CERTIS_CORE")!;
		MainEndPoint = Environment.GetEnvironmentVariable("CERTIS_MAINENDPOINT")!;
		ClientID = Environment.GetEnvironmentVariable("CERTIS_CLIENTID")!;
		ClientSecret = Environment.GetEnvironmentVariable("CERTIS_CLIENTSECRET")!;
		TenantHeaders = Environment.GetEnvironmentVariable("CERTIS_TENANTHEADERS")!;
		ExternalEndPoint = Environment.GetEnvironmentVariable("CERTIS_EXTERNAL_ENDPOINT")!;
		ExternalClient = Environment.GetEnvironmentVariable("CERTIS_EXTERNAL_CLIENT")!;
		WFM = Environment.GetEnvironmentVariable("CERTIS_WFM")!;
		IFM = Environment.GetEnvironmentVariable("CERTIS_IFM")!;
	}
}