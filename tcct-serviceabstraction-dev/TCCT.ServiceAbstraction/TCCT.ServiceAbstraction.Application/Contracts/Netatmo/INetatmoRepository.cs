using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;

namespace TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
public interface INetatmoRepository
{
	Task<user_token> GetUserTokenByTenantIdAndHomeId(string? tenantId, string? homeId);
	Task<int>  UpdateRefreshToken(Guid utid, string refreshtoken);
	Task<List<user_token_mapping>> GetListUserToken(string? tenentId, string? homeId);
	Task<user_token> GetUserToken(string clientId, string clientSecret);
	Task<Guid> CreateUserToken(string user, string clientId, string clientSecret, string refreshtoken);
	Task<int> CreateUserTokenMapping(Guid utid, string? tenantId, string? homeId);
	Task<user_token> GetUserTokenMapping(string tenantId, string? homeId, Guid utid);
	Task<int> UpdateUserTokenMapping(Guid utidNew, Guid utidOld, string? tenantId, string? homeId);
	Task<int> UpdateSyncStatus(Guid? utid, int status, int? notStatus = null);	
	Task<List<user_token_mapping>> GetListUserTokenMappingBySynsStatus(int status, int? limit = 20);
}
