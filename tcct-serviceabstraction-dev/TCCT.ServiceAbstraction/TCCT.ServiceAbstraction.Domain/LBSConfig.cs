namespace TCCT.ServiceAbstraction.Domain;
public class LBSConfig
{
	public PostgreSqlConfig Database { get; set; } = new();

	public void SetEnvironmentVariables()
	{
		Database.SetEnvironmentVariables("LBS_DB_");
	}

	public void GetEnvironmentVariables()
	{
		Database.GetEnvironmentVariables("LBS_DB_");
	}

}
