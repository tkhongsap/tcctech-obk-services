namespace TCCT.ServiceAbstraction.Domain;
public class PostgreSqlConfig
{
	public string Host { get; set; } = null!;
	public int Port { get; set; }
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;
	public string Database { get; set; } = null!;

	public void SetEnvironmentVariables(string prefix)
	{
		Environment.SetEnvironmentVariable(prefix + "HOST", Host);
		Environment.SetEnvironmentVariable(prefix + "PORT", Port.ToString());
		Environment.SetEnvironmentVariable(prefix + "USERNAME", Username);
		Environment.SetEnvironmentVariable(prefix + "PASSWORD", Password);
		Environment.SetEnvironmentVariable(prefix + "DATABASE", Database);
	}

	public void GetEnvironmentVariables(string prefix)
	{
		Host = Environment.GetEnvironmentVariable(prefix + "HOST")!;
		Port = Convert.ToInt32(Environment.GetEnvironmentVariable(prefix + "PORT")!);
		Username = Environment.GetEnvironmentVariable(prefix + "USERNAME")!;
		Password = Environment.GetEnvironmentVariable(prefix + "PASSWORD")!;
		Database = Environment.GetEnvironmentVariable(prefix + "DATABASE")!;
	}

	public string? GetConnectionString()
	{
		return $"Host={Host};Port={Port};User ID={Username};Password={Password};Database={Database};Pooling=true;Minimum Pool Size=0;Maximum Pool Size=100;Connection Lifetime=0;";
	}
}
