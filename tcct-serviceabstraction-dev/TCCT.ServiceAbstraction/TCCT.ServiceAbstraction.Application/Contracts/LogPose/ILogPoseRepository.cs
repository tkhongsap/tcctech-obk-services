namespace TCCT.ServiceAbstraction.Application.Contracts.LogPose;
public interface ILogPoseRepository
{
	Task<int> InsertMobileSensing(string app_name, double? ref_lat, double? ref_lng, string? ref_floor, string? ref_building, string? ref_qr, string? ref_grid,
		string? wifi_json, string? gps_json, string? bluetooth_json, string? magnetic_json, string? baro_json, string created_by);
}
