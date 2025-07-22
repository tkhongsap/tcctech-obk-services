using Npgsql;
using TCCT.ServiceAbstraction.Domain;

namespace TCCT.ServiceAbstraction.Infrastructure.Netatmo;
public class NetatmoDbContext
{
	NetatmoConfig _config { get; set; }

	public NetatmoDbContext(NetatmoConfig config)
	{
		_config = config;
	}

	public NpgsqlConnection GetConnection()
	{
		return new NpgsqlConnection(_config.Database.GetConnectionString());
	}

}
