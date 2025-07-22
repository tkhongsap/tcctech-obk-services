using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCommonAreas;

public class GetCommonAreasQuery : IQuery<GetCommonAreasResult>
{
	public string TenantId { get; set; }
	public int? PerPage { get; set; }
	public int? CurrentPage { get; set; }
	public GetCommonAreasQuery(string tenantId, int? perPage, int? currentPage)
	{
		TenantId = tenantId;
		PerPage = perPage;
		CurrentPage = currentPage;
	}
}
