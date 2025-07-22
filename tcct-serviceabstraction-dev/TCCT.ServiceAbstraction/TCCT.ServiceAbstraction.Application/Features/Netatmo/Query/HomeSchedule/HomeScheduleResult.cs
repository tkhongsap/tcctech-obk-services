using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeSchedule;
public class HomeScheduleResult
{
	public HomeScheduleBody body { get; set; }
	public string status { get; set; }
	public double time_exec { get; set; }
	public int time_server { get; set; }
}

public class HomeScheduleBody
{
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<Home>? homes { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public User? user { get; set; }
}

public class Home
{
	public string? id { get; set; }
	public string? name { get; set; }
	public int? altitude { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<double>? coordinates { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? country { get; set; }
	public string? timezone { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<Room>? rooms { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? temperature_control_mode { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? therm_mode { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? therm_setpoint_default_duration { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? cooling_mode { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public Schedule? schedules { get; set; }
}

public class Module
{
	public string id { get; set; }
	public string type { get; set; }
	public string name { get; set; }
	public int setup_date { get; set; }
	public string? room_id { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? bridge { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public bool? on { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public bool? offload { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? firmware_revision { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? last_seen { get; set; }
	
	public bool reachable { get; set; }
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
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<Module>? module { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public float? therm_measured_temperature { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public float? cooling_setpoint_temperature { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? cooling_setpoint_end_time { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? cooling_setpoint_mode { get; set; }
}

public class Schedule
{
	
	public List<HomeData.Timetable> timetable { get; set; }
	public Dictionary<string, List<DayOffset>> readable_timetable { get; set; }
	
	public List<HomeData.Zone> zones { get; set; }
	
	public string name { get; set; }
	
	public bool @default { get; set; }
	
	public int away_temp { get; set; }
	
	public int hg_temp { get; set; }
	
	public string id { get; set; }
	
	public string type { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<object>? timetable_sunrise { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<object>? timetable_sunset { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public bool? selected { get; set; }
}

public class Timetable
{
	public int zone_id { get; set; }
	public int m_offset { get; set; }
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
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<object>? rooms_temp { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<object>? rooms { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public List<Module>? modules { get; set; }
}

public class ReadableTimetable
{
	public int zone_id { get; set; }
	public string day { get; set; }
	public int m_offset { get; set; }
}

public class DayOffset {
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? Day { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? OffsetStart { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? OffsetEnd { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeReadable { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? ZoneId { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? ZoneType { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? ZoneName { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? MOffset { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? DateStart { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? DateEnd { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeReadableEnd { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeStart { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? TimeEnd { get; set; }
}