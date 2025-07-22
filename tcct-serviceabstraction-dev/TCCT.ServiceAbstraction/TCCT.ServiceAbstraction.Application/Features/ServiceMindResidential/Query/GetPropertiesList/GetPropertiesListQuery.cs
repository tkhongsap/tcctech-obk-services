using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertiesList;
public class GetPropertiesListQuery : IQuery<GetPropertiesListResult>
{
	public string TenantId { get; set; }
	public string? Building { get; set; }
	public GetPropertiesListQuery(string tenantId, string? building)
	{
		TenantId = tenantId;
		Building = building;
	}
}
