namespace TCCT.ServiceAbstraction.Domain.LogPose.Entities;
public class ts_mobile_sensing
{
	public Guid msid { get; set; }
	public string? app_name { get; set; }
	public double? ref_lat { get; set; }
	public double? ref_lng { get; set; }
	public string? ref_floor { get; set; }
	public string? ref_building { get; set; }
	public string? ref_qr { get; set; }
	public string? ref_grid { get; set; }
	public string? wifi_json { get; set; }
	public string? gps_json { get; set; }
	public string? bluetooth_json { get; set; }
	public string? magnetic_json { get; set; }
	public string? baro_json { get; set; }
	public string created_by { get; set; } = null!;
	public DateTime created_date { get; set; }
}
