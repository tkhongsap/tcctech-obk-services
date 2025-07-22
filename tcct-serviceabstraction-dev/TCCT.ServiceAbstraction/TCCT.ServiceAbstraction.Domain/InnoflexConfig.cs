namespace TCCT.ServiceAbstraction.Domain;
public class InnoflexConfig
{
	public string EndPoint { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;
	public string EndPointOnBoard { get; set; } = null!;
	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("INNOFLEX_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("INNOFLEX_CLIENTID", ClientID);
		Environment.SetEnvironmentVariable("INNOFLEX_CLIENTSECRET", ClientSecret);
		Environment.SetEnvironmentVariable("INNOFLEX_ENDPOINT_ONBOARD", EndPointOnBoard);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("INNOFLEX_ENDPOINT")!;
		ClientID = Environment.GetEnvironmentVariable("INNOFLEX_CLIENTID")!;
		ClientSecret = Environment.GetEnvironmentVariable("INNOFLEX_CLIENTSECRET")!;
		EndPointOnBoard = Environment.GetEnvironmentVariable("INNOFLEX_ENDPOINT_ONBOARD")!;
	}
}
