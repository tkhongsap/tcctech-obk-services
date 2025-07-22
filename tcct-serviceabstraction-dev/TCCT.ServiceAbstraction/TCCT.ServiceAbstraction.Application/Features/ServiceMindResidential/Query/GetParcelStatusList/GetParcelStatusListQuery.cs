using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcelStatusList;
public class GetParcelStatusListQuery : IQuery<GetParcelStatusListResult>
{
	public string TenantId { get; set; }

	public string? ProjectId { get; set; }
	public string? UnitId { get; set; }

	public GetParcelStatusListQuery(string tenantId, string? projectId, string? unitId)
	{
		TenantId = tenantId;
		ProjectId = projectId;
		UnitId = unitId;
	}
}
