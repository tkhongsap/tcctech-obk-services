using TCCT.ServiceAbstraction.Application.Features.LogPose;
using TCCT.ServiceAbstraction.Application.Features.LogPose.QueryPosition;
using TCCT.ServiceAbstraction.Application.Features.LogPose.SaveSensing;

namespace TCCT.ServiceAbstraction.Application.Contracts.LogPose
{
	public interface ILogPoseService
	{
		Task<QueryPositionResult> QueryPosition(List<LBSWifiScan> lbswifiscans, string? testmode);

		//Task<GetAPDistanceResponse> GetAPDistance(List<WifiScanModel> items);
		//Task<GetAPResponse> GetAP();

		Task<SaveSensingResult> SaveSensing(string app_name, double? ref_lat, double? ref_lng, string? ref_floor, string? ref_building, string? ref_qr, string? ref_grid,
			string? wifi_json, string? gps_json, string? bluetooth_json, string? magnetic_json, string? baro_json, string created_by);
	}
}
