using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
public class ScenariosQuery : IQuery<ScenariosResult>
{
	public string HomeId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;

	public ScenariosQuery(string homeId, string? tenantId)
	{
		HomeId = homeId;
		TenantId = tenantId;
	}
}
