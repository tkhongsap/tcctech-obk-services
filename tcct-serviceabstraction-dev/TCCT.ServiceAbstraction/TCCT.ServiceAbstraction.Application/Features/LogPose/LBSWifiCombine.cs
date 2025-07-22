using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose;
public class LBSWifiCombine
{
	public string ID { get; set; } = null!;
	public int level { get; set; }
	public int frequency { get; set; }
	public string BSSID { get; set; } = null!;
	public double Distance { get; set; }
	public double Lng { get; set; }
	public double Lat { get; set; }
	public string Building { get; set; } = null!;
	public string Floor { get; set; } = null!;
}
