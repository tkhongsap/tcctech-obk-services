using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTermsAndConditions;
public class GetTermsAndConditionsQuery : IQuery<GetTermsAndConditionsResult>
{
	public string TenantId { get; set; }
	public string? Lang { get; set; }
	public string ProjectId { get; set; }

	public GetTermsAndConditionsQuery(string tenantId, string? lang, string projectId)
	{
		TenantId = tenantId;
		Lang = lang;
		ProjectId = projectId;
	}
}
