using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorDetails;
public class GetVisitorDetailsQuery : IQuery<GetVisitorDetailsResult>
{
	public string? TenantId { get; set; }
	public string? VisitorId { get; set; }

	public GetVisitorDetailsQuery(string? tenantId, string? visitorId)
	{
		VisitorId = visitorId;
		TenantId = tenantId;
	}
}
