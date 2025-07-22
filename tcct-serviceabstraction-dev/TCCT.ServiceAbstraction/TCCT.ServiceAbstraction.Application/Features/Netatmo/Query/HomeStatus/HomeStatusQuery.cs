using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
public class HomeStatusQuery : IQuery<HomeStatusResult>
{
	public string HomeId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;
	public HomeStatusQuery() { }
	public HomeStatusQuery(string homeId, string? tenantId)
	{
		HomeId = homeId;
		TenantId = tenantId;
	}
}
