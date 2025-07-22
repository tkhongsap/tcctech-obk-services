namespace TCCT.ServiceAbstraction.Application.Features.LogPose.QueryPosition;
public class QueryPositionResult
{
	public double? Accuracy { get; set; }
	public double? Lat { get; set; }
	public double? Lng { get; set; }
	public string? Building { get; set; }
	public string? Floor { get; set; }
}
