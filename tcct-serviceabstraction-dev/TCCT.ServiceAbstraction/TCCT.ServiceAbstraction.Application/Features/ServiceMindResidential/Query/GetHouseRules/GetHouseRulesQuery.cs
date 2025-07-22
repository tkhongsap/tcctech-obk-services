using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRules;
public class GetHouseRulesQuery : IQuery<GetHouseRulesResult>
{
	public string? TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public string? Name { get; set; }
	public string? Lang { get; set; }
	public string? CategoryId { get; set; }

	public GetHouseRulesQuery(string? tenantId, int? page, int? limit, string? name, string? lang, string? categoryId)
	{
		Page = page;
		Limit = limit;
		Name = name;
		TenantId = tenantId;
		Lang = lang;
		CategoryId = categoryId;
	}
}
