using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncements;
public class GetAnnouncementsQuery : IQuery<GetAnnouncementsResult>
{
	public string? TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public string? ProjectIds { get; set; }
	public string? Lang { get; set; }
	public GetAnnouncementsQuery(string? tenantId, int? page, int? limit, string? projectIds, string? lang)
	{
		Page = page;
		Limit = limit;
		TenantId = tenantId;
		ProjectIds = projectIds;
		Lang = lang;
	}
}
