using System;

namespace TCCTOBK.OperationBackend.Domain;

public class RedisConfig
{
  public string Url { get; set; } = null!;
  public string DB { get; set; } = null!;
  public string Port { get; set; } = null!;


  public void GetEnvironmentVariables()
  {
    Url = Environment.GetEnvironmentVariable("REDIS_URL")!;
    Port = Environment.GetEnvironmentVariable("REDIS_PORT")!;
    DB = Environment.GetEnvironmentVariable("REDIS_DATABASE")!;
  }

  public void SetEnvironmentVariables()
  {
    Environment.SetEnvironmentVariable("REDIS_URL", Url);
    Environment.SetEnvironmentVariable("REDIS_PORT", Port);
    Environment.SetEnvironmentVariable("REDIS_DATABASE", DB);
  }

  public string GetRedisConnectionString()
	{
		return $"{Url}:{Port},defaultDatabase={DB}";
	}

}
