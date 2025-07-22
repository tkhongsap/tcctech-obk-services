using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetStatusCodes;

public class GetStatusCodesQuery : IQuery<List<GetStatusCodesResult>>
{
	public string TenantId { get; set; }
	public GetStatusCodesQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
