using Npgsql;
using TCCT.ServiceAbstraction.Domain;

namespace TCCT.ServiceAbstraction.Infrastructure.LogPose;
public class LogPoseDbContext
{
	LBSConfig _config { get; set; }

	public LogPoseDbContext(LBSConfig config)
	{
		_config = config;
	}

	public NpgsqlConnection GetConnection()
	{
		return new NpgsqlConnection(_config.Database.GetConnectionString());
	}

}
