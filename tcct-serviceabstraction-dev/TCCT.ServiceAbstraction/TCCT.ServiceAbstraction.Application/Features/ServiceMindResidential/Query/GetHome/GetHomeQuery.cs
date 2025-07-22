using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHome;
public class GetHomeQuery : IQuery<GetHomeResult>
{
	public string? TenantId { get; set; }
	public int? ProjectId { get; set;}
	public string? Lang { get; set; }

	public GetHomeQuery(string? tenantId, int? projectId, string? lang)
	{
		TenantId = tenantId;
		ProjectId = projectId;
		Lang = lang;
	}
}
