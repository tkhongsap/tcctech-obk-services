using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetAnnouncementDetails;
public class GetAnnouncementDetailsQuery : IQuery<GetAnnouncementDetailsResult>
{
	public string? TenantId { get; set; }
	public string? AnnouncementId { get; set; }
	public string? Lang { get; set; }

	public GetAnnouncementDetailsQuery(string? tenantId, string? announcementId, string? lang)
	{
		AnnouncementId = announcementId;
		TenantId = tenantId;
		Lang = lang;
	}
}
