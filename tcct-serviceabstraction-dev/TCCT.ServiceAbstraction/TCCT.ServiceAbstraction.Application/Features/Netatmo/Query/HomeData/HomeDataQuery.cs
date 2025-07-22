using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData;
public class HomeDataQuery : IQuery<HomeDataResult>
{
	public string HomeId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;

	public HomeDataQuery() { }
	public HomeDataQuery(string homeId, string? tenantId)
	{
		HomeId = homeId;
		TenantId = tenantId;
	}
}
