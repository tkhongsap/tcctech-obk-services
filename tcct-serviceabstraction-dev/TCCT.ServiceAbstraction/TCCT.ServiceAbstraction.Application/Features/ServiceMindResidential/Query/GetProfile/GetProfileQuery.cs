using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetProfile;
public class GetProfileQuery : IQuery<GetProfileResult>
{
	public string TenantId { get; set; }

	public GetProfileQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
