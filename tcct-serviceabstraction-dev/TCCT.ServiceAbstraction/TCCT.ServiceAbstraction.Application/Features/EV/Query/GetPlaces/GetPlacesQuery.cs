using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaces;
public class PlacesQuery : IQuery<PlacesResult>
{
	public required string token { get; set; }
}
