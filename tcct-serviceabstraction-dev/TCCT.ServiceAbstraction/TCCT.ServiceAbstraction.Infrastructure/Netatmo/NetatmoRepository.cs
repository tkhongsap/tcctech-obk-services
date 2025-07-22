using Dapper;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;

namespace TCCT.ServiceAbstraction.Infrastructure.Netatmo;
public class NetatmoRepository : INetatmoRepository
{
	protected readonly NetatmoDbContext _context;
	private readonly DateTime _requesttime;
	private readonly Guid _utid;

	public NetatmoRepository(NetatmoDbContext context)
	{
		_context = context;
		_requesttime = DateTime.Now; // adhoc
		_utid = Guid.NewGuid();
	}

	public async Task<user_token> GetUserTokenByTenantIdAndHomeId(string? tenantId, string? homeId)
	{
		using (var connection = _context.GetConnection())
		{
			return await connection.QueryFirstAsync<user_token>(
				"SELECT * FROM user_token as ut left join user_token_mapping as utm on utm.utid = ut.utid WHERE (utm.tenant_id = @tenantId AND utm.home_id = @homeId) OR (utm.tenant_id IS NULL AND utm.home_id = @homeId) OR (utm.home_id IS NULL) ORDER BY utm.tenant_id, utm.tenant_id IS NULL, utm.home_id IS NULL;",
				new { tenantId, homeId }
			);
		}
	}

	public async Task<int> UpdateRefreshToken(Guid utid, string refreshtoken)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "UPDATE user_token SET refresh_token = @refreshtoken, refresh_date = @refreshdate WHERE utid = @utid";
			return await connection.ExecuteAsync(sql, new { utid, refreshtoken, refreshdate = _requesttime });
		}
	}

	public async Task<List<user_token_mapping>> GetListUserToken(string? tenantId, string? homeId)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "SELECT * FROM user_token_mapping Join user_token ON user_token_mapping.utid = user_token.utid";
			if (tenantId != null) sql += $" WHERE user_token_mapping.tenant_id = @tenantId";
			if (tenantId != null && homeId != null) sql += $" AND user_token_mapping.home_id = @homeId";
			if (tenantId == null && homeId != null) sql += $" WHERE user_token_mapping.home_id = @homeId";
			return (await connection.QueryAsync<user_token_mapping>(sql.ToString(), new { tenantId, homeId })).ToList();
		}
	}

	public async Task<user_token> GetUserToken(string clientId, string clientSecret)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "SELECT * FROM user_token WHERE client_id = @clientId AND client_secret = @clientSecret;";
			return (await connection.QueryFirstOrDefaultAsync<user_token>(sql.ToString(), new { clientId, clientSecret }));
		}
	}

	public async Task<Guid> CreateUserToken(string user, string clientId, string clientSecret, string refreshtoken)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "INSERT INTO user_token (utid, email, client_id, client_secret, refresh_token, refresh_date) VALUES (@utid, @user, @clientId, @clientSecret, @refreshtoken, @refreshdate);";
			await connection.ExecuteAsync(sql, new { utid = _utid, user, clientId, clientSecret, refreshtoken, refreshdate = _requesttime });
			return _utid;
		}
	}

	public async Task<int> CreateUserTokenMapping(Guid utid, string? tenantId, string? homeId)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "INSERT INTO user_token_mapping (utid, tenant_id, home_id) VALUES (@utid, @tenantId, @homeId);";
			return await connection.ExecuteAsync(sql, new { utid, tenantId, homeId });
		}
	}

	public async Task<user_token> GetUserTokenMapping(string? tenantId, string? homeId, Guid utid)
	{
		using (var connection = _context.GetConnection())
		{
			return await connection.QueryFirstOrDefaultAsync<user_token>(
				"SELECT * FROM user_token as ut left join user_token_mapping as utm on utm.utid = ut.utid WHERE utm.tenant_id = @tenantId AND utm.home_id = @homeId AND utm.utid = @utid;",
				new { tenantId, homeId, utid }
			);
		}
	}

	public async Task<int> UpdateUserTokenMapping(Guid utidNew, Guid utidOld, string? tenantId, string? homeId)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "UPDATE user_token_mapping SET utid = @utidNew WHERE utm.tenant_id = @tenantId AND utm.home_id = @homeId AND utid = @utidOld;";
			return await connection.ExecuteAsync(sql, new { utidNew, tenantId, homeId, utidOld });
		}
	}
	
	public async Task<int> UpdateSyncStatus(Guid? utid, int status, int? notStatus = null)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "UPDATE user_token_mapping SET is_sync = @status";
			if (utid != null) {
				sql += " WHERE utid = @utid";
			}

			if (notStatus != null) {
				sql += " WHERE is_sync != @notStatus";
			}

			return await connection.ExecuteAsync(sql, new { utid, status, notStatus });
		}
	}


	public async Task<List<user_token_mapping>> GetListUserTokenMappingBySynsStatus(int status, int? limit = 50)
	{
		using (var connection = _context.GetConnection())
		{
			var sql = "SELECT * FROM user_token_mapping WHERE is_sync = @status LIMIT @limit;";
			return (await connection.QueryAsync<user_token_mapping>(sql.ToString(), new { status, limit })).ToList();
		}
	}
}
