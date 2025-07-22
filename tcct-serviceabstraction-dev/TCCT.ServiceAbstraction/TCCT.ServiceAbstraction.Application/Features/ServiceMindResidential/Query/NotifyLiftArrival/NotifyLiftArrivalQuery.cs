using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.NotifyLiftArrival;

public class NotifyLiftArrivalQuery : IQuery<NotifyLiftArrivalResult>
{
	public string? TenantId { get; set; }
	public NotifyLiftArrivalQuery(string? tenantId)
	{
		TenantId = tenantId;
	}
}
