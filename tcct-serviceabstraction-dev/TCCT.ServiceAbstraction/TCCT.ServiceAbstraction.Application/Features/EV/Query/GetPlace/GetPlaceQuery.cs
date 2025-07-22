using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlace;

public class PlaceQuery : IQuery<PlaceResult>
{
	public required string uuid { get; set; }
	public required string token { get; set; }
}
