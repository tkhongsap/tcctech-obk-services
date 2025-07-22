using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose;
public class LBSWifiScan
{
	public long timestamp { get; set; }
	public int level { get; set; }
	public int frequency { get; set; }
	public string capabilities { get; set; } = null!;
	public string BSSID { get; set; } = null!;
	public string SSID { get; set; } = null!;

	public double GetDistance()
	{
		var distance = Math.Pow(10, (27.55 - (20 * Math.Log10(frequency)) + Math.Abs(level)) / 20);
		return distance; // หน่วยเป็น เมตร
	}

}
