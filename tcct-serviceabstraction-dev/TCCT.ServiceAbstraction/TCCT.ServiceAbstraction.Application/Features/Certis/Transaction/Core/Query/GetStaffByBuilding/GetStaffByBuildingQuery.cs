using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;
public class GetStaffByBuildingQuery : IQuery<List<GetStaffByBuildingResult>>
{
	public string LocationId { get; set; }
	public string? FRIDs { get; set; }
	public int? Online { get; set;}

	public GetStaffByBuildingQuery(string locationId, string? frids, int? online)
	{
		LocationId = locationId;
		FRIDs = frids;
		Online = online;
	}
}
