using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcels;
public class GetParcelsQuery : IQuery<GetParcelsResult>
{
	public string TenantId { get; set; }
	public int? Page { get; set; }
	public int? Limit { get; set; }
	public string? ProjectId { get; set; }
	public string? ParcelStatus { get; set; }
	public string? UnitId { get; set; }
	public GetParcelsQuery(string tenantId, int? page, int? limit, string? projectId, string? parcelStatus, string? unitId)
	{
		Page = page;
		Limit = limit;
		TenantId = tenantId;
		ProjectId = projectId;
		ParcelStatus = parcelStatus;
		UnitId = unitId;
	}
}
