namespace TCCT.ServiceAbstraction.Domain.LogPose;
public class APPositionModel
{
	public string BSSID { get; set; }
	public string Name { get; set; }
	public int X { get; set; }
	public int Y { get; set; }
	public double Latitude { get; set; }
	public double Longitude { get; set; }

	public override string ToString()
	{
		return $"[{Name}] [{BSSID}] [{X},{Y}]";
	}
}
