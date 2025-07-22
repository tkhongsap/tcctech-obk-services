namespace TCCTOBK.OperationBackend.Domain;
public class CMSDBConfig
{
	public string Host { get; set; } = null!;
	public int Port { get; set; }
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;
	public string Database { get; set; } = null!;

	public void GetEnvironmentVariables()
	{
		Host = Environment.GetEnvironmentVariable("CMSDB_HOST")!;
		Port = Convert.ToInt32(Environment.GetEnvironmentVariable("CMSDB_PORT")!);
		Username = Environment.GetEnvironmentVariable("CMSDB_USERNAME")!;
		Password = Environment.GetEnvironmentVariable("CMSDB_PASSWORD")!;
		Database = Environment.GetEnvironmentVariable("CMSDB_DATABASE")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("CMSDB_HOST", Host);
		Environment.SetEnvironmentVariable("CMSDB_PORT", Port.ToString());
		Environment.SetEnvironmentVariable("CMSDB_USERNAME", Username);
		Environment.SetEnvironmentVariable("CMSDB_PASSWORD", Password);
		Environment.SetEnvironmentVariable("CMSDB_DATABASE", Database);
	}

	public string GetPostgreSQLConnectionString()
	{
		return $"Host={Host};Port={Port};User ID={Username};Password={Password};Database={Database};Pooling=true;Minimum Pool Size=0;Maximum Pool Size=100;Connection Lifetime=0;";
	}

}

