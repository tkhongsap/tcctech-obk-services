namespace TCCTOBK.OperationBackend.Domain;
public class SerilogConfig
{
	public string EndPoint { get; set; } = null!;
	public string APIKey { get; set; } = null!;

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("SERILOG_SEQ_ENDPOINT")!;
		APIKey = Environment.GetEnvironmentVariable("SERILOG_SEQ_APIKEY")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("SERILOG_SEQ_ENDPOINT", EndPoint);
		Environment.SetEnvironmentVariable("SERILOG_SEQ_APIKEY", APIKey);
	}
}