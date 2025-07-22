using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaceBuilding;

public class PlaceBuildingQuery : IQuery<PlaceBuildingResult>
{
	public required string building { get; set; }
	public required string token { get; set; }
	public required string place { get; set; }
	public string? date { get; set; }
}
