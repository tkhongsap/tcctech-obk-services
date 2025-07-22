using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetServiceRequestStatusCodes;

public class GetServiceRequestStatusCodesQuery : IQuery<List<GetServiceRequestStatusCodesResult>>
{
	public string TenantId { get; set; }
	public GetServiceRequestStatusCodesQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
