using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRulesCategories;
public class GetHouseRulesCategoriesQuery : IQuery<GetHouseRulesCategoriesResult>
{
	public string? TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public string? Name { get; set; }
	public string? Lang { get; set; }
	public string? ProjectId { get; set; }

	public GetHouseRulesCategoriesQuery(string? tenantId, int? page, int? limit, string? name, string? lang, string? projectId)
	{
		Page = page;
		Limit = limit;
		Name = name;
		TenantId = tenantId;
		Lang = lang;
		ProjectId = projectId;
	}
}
