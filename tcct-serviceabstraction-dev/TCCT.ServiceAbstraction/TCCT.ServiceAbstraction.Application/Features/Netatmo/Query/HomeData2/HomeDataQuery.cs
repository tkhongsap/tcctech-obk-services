using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData2;
public class HomeDataQuery2 : IQuery<HomeDataResult2>
{
	public string HomeId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;

	public HomeDataQuery2() { }
	public HomeDataQuery2(string homeId, string? tenantId)
	{
		HomeId = homeId;
		TenantId = tenantId;
	}
}
