namespace TCCT.ServiceAbstraction.Domain;
public class MTConfig
{
	public string EndPoint { get; set; } = null!;
	public string APIKey { get; set; } = null!;
	public string EndPointCarpark { get; set; } = null!;
	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("MT_SERVICE_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("MT_SERVICE_APIKEY", APIKey);
		Environment.SetEnvironmentVariable("MT_SERVICE_ENDPOINT_CARPARK", EndPointCarpark);
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("MT_SERVICE_ENDPOINT")!;
		APIKey = Environment.GetEnvironmentVariable("MT_SERVICE_APIKEY")!;
		EndPointCarpark = Environment.GetEnvironmentVariable("MT_SERVICE_ENDPOINT_CARPARK")!;
	}
}
