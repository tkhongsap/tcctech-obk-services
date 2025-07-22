using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCT.ServiceAbstraction.Infrastructure.LogPose;


public class AccessPointItem
{
	public string ID { get; set; } = null!;
	public List<string> BSSID { get; set; } = new();
	public double Lng { get; set; }
	public double Lat { get; set; }
	public string Building { get; set; } = null!;
	public string Floor { get; set; } = null!;
}

public static class LogPoseAccessPoint
{
	public static List<AccessPointItem> Items { get; set; } = new()
	{
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-08", BSSID = new List<string> { "78:cf:2f:6b:d3:00","78:cf:2f:6b:d3:10" }, Lng = 100.546452652666, Lat = 13.7260753636714, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-10", BSSID = new List<string> { "78:cf:2f:6b:d5:80","78:cf:2f:6b:d5:90" }, Lng = 100.546483341956, Lat = 13.7263252409931, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-11", BSSID = new List<string> { "78:cf:2f:6b:d4:80","78:cf:2f:6b:d4:90" }, Lng = 100.546502067624, Lat = 13.7264073579355, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-12", BSSID = new List<string> { "78:cf:2f:6b:d4:20","78:cf:2f:6b:d4:30" }, Lng = 100.546477100066, Lat = 13.7266527011929, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-13", BSSID = new List<string> { "78:cf:2f:6b:d6:20","78:cf:2f:6b:d6:30" }, Lng = 100.546664876906, Lat = 13.7266053454102, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-15", BSSID = new List<string> { "","" }, Lng = 100.546935878938, Lat = 13.7265771334545, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-16", BSSID = new List<string> { "","" }, Lng = 100.547104409952, Lat = 13.7265514404234, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-09", BSSID = new List<string> { "78:cf:2f:6b:d4:40","78:cf:2f:6b:d4:50" }, Lng = 100.546355383223, Lat = 13.7260980339929, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-04", BSSID = new List<string> { "78:cf:2f:6b:d6:a0","78:cf:2f:6b:d6:b0" }, Lng = 100.546914552483, Lat = 13.7260154132655, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-18", BSSID = new List<string> { "78:cf:2f:6b:d5:e0","78:cf:2f:6b:d5:f0" }, Lng = 100.547366569308, Lat = 13.7262118893854, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-01", BSSID = new List<string> { "","" }, Lng = 100.547234449315, Lat = 13.7261469011304, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-20", BSSID = new List<string> { "","" }, Lng = 100.547232888843, Lat = 13.7262058439664, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-02", BSSID = new List<string> { "","" }, Lng = 100.547103889795, Lat = 13.7261705790218, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-03", BSSID = new List<string> { "","" }, Lng = 100.546953044134, Lat = 13.7261932493433, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-06", BSSID = new List<string> { "78:cf:2f:6b:d4:c0","78:cf:2f:6b:d4:d0" }, Lng = 100.546724695013, Lat = 13.7262123931704, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-05", BSSID = new List<string> { "78:cf:2f:55:3f:30","78:cf:2f:55:3f:40" }, Lng = 100.546775150286, Lat = 13.7260804015206, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-07", BSSID = new List<string> { "78:cf:2f:6b:d3:e0","78:cf:2f:6b:d3:f0" }, Lng = 100.546641989978, Lat = 13.7261584881836, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-19", BSSID = new List<string> { "78:cf:2f:6b:d5:c0","78:cf:2f:6b:d5:d0" }, Lng = 100.54723965089, Lat = 13.7258496680259, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk01-ap-14", BSSID = new List<string> { "","" }, Lng = 100.546934838623, Lat = 13.7264426228801, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-rk02-ap-17", BSSID = new List<string> { "","" }, Lng = 100.547339000963, Lat = 13.7265040846407, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-mrt-ap01", BSSID = new List<string> { "78:cf:2f:6b:d5:20","78:cf:2f:6b:d5:30" }, Lng = 100.546430285896, Lat = 13.7258793913364, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "r1-b1-ict-mrt-ap02", BSSID = new List<string> { "78:cf:2f:6b:d2:e0","78:cf:2f:6b:d2:f0" }, Lng = 100.546291924014, Lat = 13.7257418580524, Building = "r1", Floor = "b1" },
		new AccessPointItem { ID = "o2-b1-ict-rk01-ap02", BSSID = new List<string> { "78:cf:2f:6b:e6:60" }, Lng = 100.546427685109, Lat = 13.726769579295, Building = "o2", Floor = "b1" },

		new AccessPointItem { ID = "o2-l1-ict-rk01-ap-01", BSSID = new List<string> { "cc:20:8c:84:95:10","cc:20:8c:84:95:20" }, Lng = 100.546565045819, Lat = 13.7270527549793, Building = "o2", Floor = "l1" },
		new AccessPointItem { ID = "ap05", BSSID = new List<string> { "cc:20:8c:84:91:e0","cc:20:8c:84:91:d0" }, Lng = 100.546417036057, Lat = 13.7267585688631, Building = "o2", Floor = "l1" },
		new AccessPointItem { ID = "SP1", BSSID = new List<string> { "c0:e0:18:90:d1:e0","c0:e0:18:90:d1:f0" }, Lng = 100.546670320369, Lat = 13.7266943271809, Building = "o2", Floor = "l1" },
		new AccessPointItem { ID = "SP2", BSSID = new List<string> { "c0:f6:ec:d5:a5:10","c0:f6:ec:d5:a5:20" }, Lng = 100.546741719444, Lat = 13.7271098586968, Building = "o2", Floor = "l1" },
		new AccessPointItem { ID = "ap03", BSSID = new List<string> { "cc:20:8c:84:7e:60" }, Lng = 100.546536903118, Lat = 13.7268564609503, Building = "o2", Floor = "l1" },

		new AccessPointItem { ID = "1", BSSID = new List<string> { "cc:20:8c:84:92:d0", "cc:20:8c:84:92:e0" }, Lng = 100.546370206067, Lat = 13.7265876066976, Building = "r2", Floor = "lg" },
		new AccessPointItem { ID = "2", BSSID = new List<string> { "cc:20:8c:84:91:d0","cc:20:8c:84:91:e0" }, Lng = 100.546517274639, Lat = 13.7266631812902, Building = "r2", Floor = "lg" },
		new AccessPointItem { ID = "3", BSSID = new List<string> { "cc:20:8c:84:94:a0","cc:20:8c:84:94:90" }, Lng = 100.54669127126, Lat = 13.7267849121777, Building = "r2", Floor = "lg" },

	};

}
