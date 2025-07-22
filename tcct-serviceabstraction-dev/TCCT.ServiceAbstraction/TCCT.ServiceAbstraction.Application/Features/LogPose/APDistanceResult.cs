namespace TCCT.ServiceAbstraction.Application.Features.LogPose;

public class APDistanceResult
{
	public string Name { get; set; } = null!;
	public string SSID { get; set; } = null!;
	public string BSSID { get; set; } = null!;
	public float Frequency { get; set; }
	public int X { get; set; }
	public int Y { get; set; }
	public double Distance { get; set; }
}

