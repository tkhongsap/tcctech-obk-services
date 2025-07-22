namespace TCCT.ServiceAbstraction.Domain.LogPose;
public class WifiScanModel
{
	public float level { get; set; } // หน่วยเป็น dBm
	public float frequency { get; set; } // หน่วยเป็น MHz
	public string BSSID { get; set; } = null!;
	public string SSID { get; set; } = null!;

	public double GetDistance()
	{
		var distance = Math.Pow(10, (27.55 - (20 * Math.Log10(frequency)) + Math.Abs(level)) / 20);
		return distance; // หน่วยเป็น เมตร
	}

}
