using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedTemperature;

public class GetFeedTemperatureQuery : IQuery<List<GetCalculatedResult>>
{
	public string Building { get; set; }
	public string? Floor { get; set; }
	public string? Status { get; set; }

	public GetFeedTemperatureQuery(string building, string? floor, string? status)
	{
		Building = building;
		Floor = floor;
		Status = status;
	}
}
