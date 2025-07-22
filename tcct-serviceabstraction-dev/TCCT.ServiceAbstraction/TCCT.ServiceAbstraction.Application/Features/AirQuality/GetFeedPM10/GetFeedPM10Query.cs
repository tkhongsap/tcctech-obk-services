using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM10;

public class GetFeedPM10Query : IQuery<List<GetCalculatedResult>>
{
	public string Building { get; set; }
	public string? Floor { get; set; }
	public string? Status { get; set; }

	public GetFeedPM10Query(string building, string? floor, string? status)
	{
		Building = building;
		Floor = floor;
		Status = status;
	}
}
