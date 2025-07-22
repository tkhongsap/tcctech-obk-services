using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.SaveSensing;
public class SaveSensingCommand : ICommand<SaveSensingResult>
{
	public string AppName { get; set; } = null!;
	public double? RefLat { get; set; }
	public double? RefLong { get; set; }
	public string? RefFloor { get; set; }
	public string? RefBuilding { get; set; }
	public string? RefQR { get; set; }
	public string? RefGrid { get; set; }
	public string? WifiJson { get; set; }
	public string? GpsJson { get; set; }
	public string? BluetoothJson { get; set; }
	public string? MagneticJson { get; set; }
	public string? BaroJson { get; set; }
	public string CreatedBy { get; set; } = null!;

	public SaveSensingCommand(string appName, double? refLat, double? refLong, string? reffloor, string? refbuilding, string? refqr, string? refgrid, string? wifiJson, string? gpsJson, string? bluetoothJson, string? magneticJson, string? baroJson, string createdBy)
	{
		AppName = appName;
		RefLat = refLat;
		RefLong = refLong;
		RefFloor = reffloor;
		RefBuilding = refbuilding;
		RefQR = refqr;
		RefGrid = refgrid;
		WifiJson = wifiJson;
		GpsJson = gpsJson;
		BluetoothJson = bluetoothJson;
		MagneticJson = magneticJson;
		BaroJson = baroJson;
		CreatedBy = createdBy;
	}
}
