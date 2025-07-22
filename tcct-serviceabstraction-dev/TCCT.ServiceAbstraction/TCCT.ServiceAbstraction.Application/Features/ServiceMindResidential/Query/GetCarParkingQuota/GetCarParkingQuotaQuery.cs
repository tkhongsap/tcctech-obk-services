using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuota;
public class GetCarParkingQuotaQuery : IQuery<GetCarParkingQuotaResult>
{
	public string TenantId { get; set; }

	public GetCarParkingQuotaQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
