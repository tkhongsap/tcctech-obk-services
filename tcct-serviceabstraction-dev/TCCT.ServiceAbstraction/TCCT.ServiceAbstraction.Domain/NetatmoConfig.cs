namespace TCCT.ServiceAbstraction.Domain;
public class NetatmoConfig
{
	public string EndPoint { get; set; } = null!;

	public PostgreSqlConfig Database { get; set; } = new();

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("NETATMO_ENDPOINT", EndPoint);

		Database.SetEnvironmentVariables("NETATMO_DB_");
	}

	public void GetEnvironmentVariables()
	{
		EndPoint = Environment.GetEnvironmentVariable("NETATMO_ENDPOINT")!;

		Database.GetEnvironmentVariables("NETATMO_DB_");
	}

}
