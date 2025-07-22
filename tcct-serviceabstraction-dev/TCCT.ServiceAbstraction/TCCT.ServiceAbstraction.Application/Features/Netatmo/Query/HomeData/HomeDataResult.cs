using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData;
public class HomeDataResult
{
	public HomeDataBody body { get; set; }
	public string status { get; set; }
	public double time_exec { get; set; }
	public int time_server { get; set; }
}

public class HomeDataBody
{
	public List<Home> homes { get; set; }
	public User user { get; set; }
}

public class Home
{
	public string id { get; set; }
	public string name { get; set; }
	public int altitude { get; set; }
	public List<double> coordinates { get; set; }
	public string country { get; set; }
	public string timezone { get; set; }
	public List<Room> rooms { get; set; }
	public List<Module> modules { get; set; }
	public string temperature_control_mode { get; set; }
	public string therm_mode { get; set; }
	public int therm_setpoint_default_duration { get; set; }
	public string cooling_mode { get; set; }
	public List<Schedule> schedules { get; set; }
}

public class Module
{
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string id { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string type { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string name { get; set; }
	public int setup_date { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string room_id { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? room_name { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<string> modules_bridged { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string bridge { get; set; }

	public bool on { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? brightness { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? current_position { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? target_position { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? target_positionstep { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public bool? cooler_status { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? fan_speed { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? fan_mode { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? humidity { get; set; }
}

public class Room
{
	public string id { get; set; }
	public string name { get; set; }
	public string type { get; set; }
	public List<string> module_ids { get; set; }
	public List<Module>? module { get; set; }
	public float? therm_measured_temperature { get; set; }
	public float? cooling_setpoint_temperature { get; set; }
	public int? cooling_setpoint_end_time { get; set; }
	public string? cooling_setpoint_mode { get; set; }
}

public class Schedule
{
	public List<Timetable> timetable { get; set; }
	public List<Zone> zones { get; set; }
	public string name { get; set; }
	public bool @default { get; set; }
	public int away_temp { get; set; }
	public int hg_temp { get; set; }
	public string id { get; set; }
	public string type { get; set; }
	public List<object> timetable_sunrise { get; set; }
	public List<object> timetable_sunset { get; set; }
	public bool? selected { get; set; }
}

public class Timetable
{
	public int zone_id { get; set; }
	public int m_offset { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? m_offset_start { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? m_offset_end { get; set; }
}

public class User
{
	public string email { get; set; }
	public string language { get; set; }
	public string locale { get; set; }
	public int feel_like_algorithm { get; set; }
	public int unit_pressure { get; set; }
	public int unit_system { get; set; }
	public int unit_wind { get; set; }
	public string id { get; set; }
}

public class Zone
{
	public string name { get; set; }
	public int id { get; set; }
	public int type { get; set; }
	public List<object> rooms_temp { get; set; }
	public List<Room> rooms { get; set; }
	public List<Module> modules { get; set; }
	public List<string>? scenarios { get; set; }
}

