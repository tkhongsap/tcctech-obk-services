using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDefaultProperty;
public class GetDefaultPropertyQuery : IQuery<GetDefaultPropertyResult>
{
	public string? TenantId { get; set; }

	public GetDefaultPropertyQuery(string? tenantId)
	{
		TenantId = tenantId;
	}
}
