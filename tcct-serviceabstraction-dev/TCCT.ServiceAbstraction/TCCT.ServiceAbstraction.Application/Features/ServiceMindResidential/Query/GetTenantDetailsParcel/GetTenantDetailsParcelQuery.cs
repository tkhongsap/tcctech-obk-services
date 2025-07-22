using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTenantDetailsParcel;
public class GetTenantDetailsParcelQuery : IQuery<GetTenantDetailsParcelResult>
{
	public string TenantId { get; set; }

	public string ParcelId { get; set; }

	public GetTenantDetailsParcelQuery(string tenantId, string parcelId)
	{
		TenantId = tenantId;
		ParcelId = parcelId;
	}
}
