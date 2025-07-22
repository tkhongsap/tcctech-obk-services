using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertieDetails;
public class GetPropertieDetailsQuery : IQuery<GetPropertieDetailsResult>
{
	public string TenantId { get; set; }
	public string PropertyUnitId { get; set; }


	public GetPropertieDetailsQuery(string tenantId, string propertyUnitId)
	{
		TenantId = tenantId;
		PropertyUnitId = propertyUnitId;
	}
}
