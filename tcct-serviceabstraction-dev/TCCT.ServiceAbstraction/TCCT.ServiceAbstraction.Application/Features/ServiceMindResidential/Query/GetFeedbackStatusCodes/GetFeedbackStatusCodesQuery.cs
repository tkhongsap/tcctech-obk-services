using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetFeedbackStatusCodes;

public class GetFeedbackStatusCodesQuery : IQuery<List<GetFeedbackStatusCodesResult>>
{
	public string TenantId { get; set; }
	public GetFeedbackStatusCodesQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
