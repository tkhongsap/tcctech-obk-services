namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetOutdoorZone;
public class GetOutdoorZoneResponse
{
	public string Name { get; set; } = null!;
	public OutdoorZoneDisplay Display { get; set; } = null!;
	public string Code { get; set; } = null!;
}

public class OutdoorZoneDisplay
{
	public string? EN { get; set; }
	public string? TH { get; set; }
	public string? ZH { get; set; }
}