using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM25;

public class GetFeedPM25Query : IQuery<List<GetCalculatedResult>>
{
	public string Building { get; set; }
	public string? Floor { get; set; }
	public string? Status { get; set; }

	public GetFeedPM25Query(string building, string? floor, string? status)
	{
		Building = building;
		Floor = floor;
		Status = status;
	}
}
