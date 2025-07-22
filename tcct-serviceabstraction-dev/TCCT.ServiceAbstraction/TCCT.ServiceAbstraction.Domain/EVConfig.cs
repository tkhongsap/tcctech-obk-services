namespace TCCT.ServiceAbstraction.Domain;
public class EVConfig
{
	public string EndPoint { get; set; } = null!;
	public string PublicKey { get; set; } = null!;
	public string PrivateKey { get; set; } = null!;
	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("EV_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("EV_PUBLIC_KEY", PublicKey);
		Environment.SetEnvironmentVariable("EV_PRIVATE_KEY", PrivateKey);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("EV_ENDPOINT")!;
		PublicKey = Environment.GetEnvironmentVariable("EV_PUBLIC_KEY")!;
		PrivateKey = Environment.GetEnvironmentVariable("EV_PRIVATE_KEY")!;
	}
}