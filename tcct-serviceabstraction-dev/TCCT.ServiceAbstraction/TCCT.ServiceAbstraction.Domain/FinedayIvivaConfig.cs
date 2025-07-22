namespace TCCT.ServiceAbstraction.Domain;
public class FinedayIvivaConfig
{
	public string EndPoint { get; set; } = null!;
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("FINEDAYIVIVA_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("FINEDAYIVIVA_USERNAME", Username);
		Environment.SetEnvironmentVariable("FINEDAYIVIVA_PASSWORD", Password);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("FINEDAYIVIVA_ENDPOINT")!;
		Username = Environment.GetEnvironmentVariable("FINEDAYIVIVA_USERNAME")!;
		Password = Environment.GetEnvironmentVariable("FINEDAYIVIVA_PASSWORD")!;
	}

}
