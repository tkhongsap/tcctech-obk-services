namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
public class GetStaffByBuildingQuery
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
