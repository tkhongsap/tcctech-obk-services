using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetRegisteredVehicles;
public class GetRegisteredVehiclesQuery : IQuery<GetRegisteredVehiclesResult>
{
	public string TenantId { get; set; }

	public GetRegisteredVehiclesQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
