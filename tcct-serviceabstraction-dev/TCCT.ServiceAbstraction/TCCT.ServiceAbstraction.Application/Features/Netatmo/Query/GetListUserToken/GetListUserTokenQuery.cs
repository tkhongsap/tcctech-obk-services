using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.GetListUserToken;
public class GetListUserTokenQuery : IQuery<GetListUserTokenResult>
{
	public string? HomeId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;
	public GetListUserTokenQuery() { }
	public GetListUserTokenQuery(string? homeId, string? tenantId)
	{
		HomeId = homeId;
		TenantId = tenantId;
	}
}
