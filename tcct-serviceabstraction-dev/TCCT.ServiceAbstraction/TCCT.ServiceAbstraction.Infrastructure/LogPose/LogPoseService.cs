using TCCT.ServiceAbstraction.Application.Contracts.LogPose;
using TCCT.ServiceAbstraction.Application.Features.LogPose;
using TCCT.ServiceAbstraction.Application.Features.LogPose.GetAP;
using TCCT.ServiceAbstraction.Application.Features.LogPose.GetAPDistance;
using TCCT.ServiceAbstraction.Application.Features.LogPose.QueryPosition;
using TCCT.ServiceAbstraction.Application.Features.LogPose.SaveSensing;
using TCCT.ServiceAbstraction.Domain.LogPose;

namespace TCCT.ServiceAbstraction.Infrastructure.LogPose;

public class LogPoseService(ILogPoseRepository repo, IHttpClientFactory httpClientFactory) : ILogPoseService
{
	private readonly ILogPoseRepository _repo = repo;
	private readonly IHttpClientFactory _httpclientfactory = httpClientFactory;


	public async Task<QueryPositionResult> QueryPosition(List<LBSWifiScan> lbswifiscans, string? testmode)
	{
		// เอาเฉพาะที่รู้จัก BSSID จาก LogPoseAccessPoint, แล้วเอาเฉพาะที่ level > -70
		var minlevel = -70;
		lbswifiscans = lbswifiscans.Where(x => x.level > minlevel).Where(x => LogPoseAccessPoint.Items.SelectMany(y => y.BSSID).Contains(x.BSSID)).ToList();

		if (testmode == "2g")
		{
			lbswifiscans = lbswifiscans.Where(x => x.frequency < 3000).ToList();
		}
		else if (testmode == "5g")
		{
			lbswifiscans = lbswifiscans.Where(x => x.frequency > 3000).ToList();
		}

		var combineresults = new List<LBSWifiCombine>();
		foreach (var item in lbswifiscans)
		{
			var apsrc = LogPoseAccessPoint.Items.FirstOrDefault(x => x.BSSID.Contains(item.BSSID))!;
			var apdst = new LBSWifiCombine
			{
				ID = apsrc.ID,
				level = item.level,
				frequency = item.frequency,
				BSSID = item.BSSID,
				Distance = item.GetDistance(),
				Lng = apsrc.Lng,
				Lat = apsrc.Lat,
				Building = apsrc.Building,
				Floor = apsrc.Floor
			};
			combineresults.Add(apdst);
		}

		//-- เรียงลำดับตามระยะทาง
		combineresults = combineresults.OrderBy(x => x.Distance).ToList();

		var res = new QueryPositionResult();
		if (combineresults.Count == 0)
		{
			res.Accuracy = 0;
			return res;
		}

		res.Accuracy = 10;
		res.Floor = combineresults[0].Floor;
		res.Building = combineresults[0].Building;

		// from combineresults calculate estimated position
		var sumlat = 0.0;
		var sumlng = 0.0;
		var sumweight = 0.0;
		foreach (var item in combineresults)
		{
			var weight = 1 / Math.Pow(item.Distance, 2);
			sumlat += item.Lat * weight;
			sumlng += item.Lng * weight;
			sumweight += weight;
		}
		res.Lat = sumlat / sumweight;
		res.Lng = sumlng / sumweight;
		return res;
	}

	public async Task<SaveSensingResult> SaveSensing(string app_name, double? ref_lat, double? ref_lng, string? ref_floor, string? ref_building, string? ref_qr, string? ref_grid,
		string? wifi_json, string? gps_json, string? bluetooth_json, string? magnetic_json, string? baro_json, string created_by)
	{
		await _repo.InsertMobileSensing(app_name, ref_lat, ref_lng, ref_floor, ref_building, ref_qr, ref_grid, wifi_json, gps_json, bluetooth_json, magnetic_json, baro_json, created_by);

		var res = new SaveSensingResult();
		return res;
	}
}
