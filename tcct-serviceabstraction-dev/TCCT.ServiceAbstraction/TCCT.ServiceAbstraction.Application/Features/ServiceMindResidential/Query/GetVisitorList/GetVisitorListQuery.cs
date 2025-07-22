using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorList;

public class GetVisitorListQuery : IQuery<GetVisitorListResult>
{
	public string? TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public int? Type { get; set; } //for Active List; 2 for Expired List;
	public string? Search { get; set; }
	public string? UnitId { get; set; }
	public GetVisitorListQuery(string? tenantId, int? page, int? limit, int? type, string? search, string? unitId)
	{
		Page = page;
		Limit = limit;
		TenantId = tenantId;
		Type = type;
		Search = search;
		UnitId = unitId;
	}
}
