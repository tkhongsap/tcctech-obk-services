namespace TCCTOBK.OperationBackend.Domain;
public class KongConfig
{
	public string ConsumerKey { get; set; } = null!;
	public string ConsumerSecret { get; set; } = null!;

	public void GetEnvironmentVariables()
	{
		ConsumerKey = Environment.GetEnvironmentVariable("KONG_CONSUMERKEY")!;
		ConsumerSecret = Environment.GetEnvironmentVariable("KONG_CONSUMERSECRET")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("KONG_CONSUMERKEY", ConsumerKey);
		Environment.SetEnvironmentVariable("KONG_CONSUMERSECRET", ConsumerSecret);
	}

}

