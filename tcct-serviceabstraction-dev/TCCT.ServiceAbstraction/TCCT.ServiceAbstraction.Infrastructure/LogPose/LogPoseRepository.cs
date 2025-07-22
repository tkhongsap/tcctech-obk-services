using Dapper;
using TCCT.ServiceAbstraction.Application.Contracts.LogPose;
using TCCT.ServiceAbstraction.Domain.LogPose.Entities;

namespace TCCT.ServiceAbstraction.Infrastructure.LogPose;
public class LogPoseRepository : ILogPoseRepository
{
	protected readonly LogPoseDbContext _context;
	private readonly DateTime _requesttime;

	public LogPoseRepository(LogPoseDbContext context)
	{
		_context = context;
		_requesttime = DateTime.Now; // adhoc
	}

	public async Task<int> InsertMobileSensing(string app_name, double? ref_lat, double? ref_lng, string? ref_floor, string? ref_building, string? ref_qr, string? ref_grid,
		string? wifi_json, string? gps_json, string? bluetooth_json, string? magnetic_json, string? baro_json, string created_by)
	{
		var item = new ts_mobile_sensing();
		item.msid = Guid.NewGuid();
		item.app_name = app_name;
		item.ref_lat = ref_lat;
		item.ref_lng = ref_lng;
		item.ref_floor = ref_floor;
		item.ref_building = ref_building;
		item.ref_qr = ref_qr;
		item.ref_grid = ref_grid;
		item.wifi_json = wifi_json;
		item.gps_json = gps_json;
		item.bluetooth_json = bluetooth_json;
		item.magnetic_json = magnetic_json;
		item.baro_json = baro_json;
		item.created_by = created_by;
		item.created_date = _requesttime;

		using (var connection = _context.GetConnection())
		{
			var sql = "INSERT INTO ts_mobile_sensing (msid, app_name, ref_lat, ref_lng, ref_floor, ref_building, ref_qr, ref_grid, wifi_json, gps_json, bluetooth_json, magnetic_json, baro_json, created_by, created_date) VALUES (@msid, @app_name, @ref_lat, @ref_lng, @ref_floor, @ref_building, @ref_qr, @ref_grid, @wifi_json, @gps_json, @bluetooth_json, @magnetic_json, @baro_json, @created_by, @created_date)";
			return await connection.ExecuteAsync(sql, item);
		}
	}

}


