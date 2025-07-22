namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetSimpleFeedAll;
public class GetSimpleFeedAllResponse
{
	public string? channel { get; set; }
	public string? type { get; set; }
	public string? status { get; set; }
	public string? unit { get; set; }
	public string? site { get; set; }
	public string? zone { get; set; }
	public string? buildingName { get; set; }
	public string? buildingCode { get; set; }
	public string? floorName { get; set; }
	public string? floorCode { get; set; }

	public string? timestamp { get; set; }
	public double? value { get; set; }
}
