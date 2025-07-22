using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetActiveFloor;

public class GetActiveFloorQuery : IQuery<GetActiveFloorResponse>
{
	public string Building { get; set; }

	public GetActiveFloorQuery(string building)
	{
		Building = building;
	}
}
