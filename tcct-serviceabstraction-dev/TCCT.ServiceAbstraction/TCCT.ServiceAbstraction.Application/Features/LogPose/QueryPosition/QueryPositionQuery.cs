using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.QueryPosition;

public class QueryPositionQuery : IQuery<QueryPositionResult>
{
	public string AppName { get; set; } = null!;
	public string? WifiJson { get; set; }
	public string? GpsJson { get; set; }
	public string? BluetoothJson { get; set; }
	public string? MagneticJson { get; set; }
	public string? BaroJson { get; set; }
	public string? TestMode { get; set; }
	public double? TestLng{ get; set; }
	public double? TestLat { get; set; }
	public string? TestBuilding { get; set; }
	public string? TestFloor { get; set; }

	public QueryPositionQuery(string appname, string? wifiJson, string? gpsJson, string? bluetoothJson, string? magneticJson, string? baroJson, string? testmode, double? testlng, double? testlat, string? testbuilding, string? testfloor)
	{
		AppName = appname;
		WifiJson = wifiJson;
		GpsJson = gpsJson;
		BluetoothJson = bluetoothJson;
		MagneticJson = magneticJson;
		BaroJson = baroJson;
		TestMode = testmode;
		TestLng = testlng;
		TestLat = testlat;
		TestBuilding = testbuilding;
		TestFloor = testfloor;
	}
}
