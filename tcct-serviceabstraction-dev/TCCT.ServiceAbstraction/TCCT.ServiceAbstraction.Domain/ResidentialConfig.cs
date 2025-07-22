namespace TCCT.ServiceAbstraction.Domain;
public class ResidentialConfig
{
	public string EndPoint { get; set; } = null!;
	public string ClientSecret { get; set;} = null!;
	public string DefaultTenant { get; set; } = null!;

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("SERVICEMIND_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("SERVICEMIND_CLIENTSECRET", ClientSecret);
		Environment.SetEnvironmentVariable("SERVICEMIND_DEFAULTTENANT", DefaultTenant);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("SERVICEMIND_ENDPOINT")!;
		ClientSecret = Environment.GetEnvironmentVariable("SERVICEMIND_CLIENTSECRET")!;
		DefaultTenant = Environment.GetEnvironmentVariable("SERVICEMIND_DEFAULTTENANT")!;
	}
}
