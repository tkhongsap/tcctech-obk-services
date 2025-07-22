using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Tenant.GetDataTenant;
public class GetDataTenantQuery : IQuery<GetDataTenantResult>
{
	public string? Search { get; set; }
	public string? StartDate { get; set; }
	public string? EndDate { get; set; }
	public bool Active { get; set; }

	public GetDataTenantQuery(string? search, string? startdate, string? enddate, bool active)
	{
		Search = search;
		StartDate = startdate;
		EndDate = enddate;
		Active = active;
	}
}
