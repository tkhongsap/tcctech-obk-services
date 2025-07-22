using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedCO2;

public class GetFeedCO2Query : IQuery<List<GetCalculatedResult>>
{
	public string Building { get; set; }
	public string? Floor { get; set; }
	public string? Status { get; set; }

	public GetFeedCO2Query(string building, string? floor, string? status)
	{
		Building = building;
		Floor = floor;
		Status = status;
	}
}
