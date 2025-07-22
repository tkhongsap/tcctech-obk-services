using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedAll;

public class GetFeedAllQuery : IQuery<List<GetCalculatedResult>>
{
	public string Building { get; set; }
	public string? Floor { get; set; }
	public string? Status { get; set; }

	public GetFeedAllQuery(string building, string? floor, string? status)
	{
		Building = building;
		Floor = floor;
		Status = status;
	}
}
