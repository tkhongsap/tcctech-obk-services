using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaires;
public class GetQuestionnairesQuery : IQuery<GetQuestionnairesResult>
{
	public string TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public int? ProjectId { get; set; }
	public string? Lang { get; set; }
	public GetQuestionnairesQuery(string tenantId, int? page, int? limit, int? projectId, string? lang)
	{
		TenantId = tenantId;
		Page = page;
		Limit = limit;
		ProjectId = projectId;
		Lang = lang;
	}
}
