using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuotaUnitWise;
public class GetCarParkingQuotaUnitWiseQuery : IQuery<GetCarParkingQuotaUnitWiseResult>
{
	public string TenantId { get; set; }

	public GetCarParkingQuotaUnitWiseQuery(string tenantId)
	{
		TenantId = tenantId;
	}
}
