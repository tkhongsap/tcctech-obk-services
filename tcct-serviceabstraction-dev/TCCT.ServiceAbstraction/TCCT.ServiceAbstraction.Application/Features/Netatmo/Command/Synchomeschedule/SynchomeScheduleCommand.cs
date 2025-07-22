using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
public class SynchomeScheduleCommand : ICommand<SynchomeScheduleResult>
{
	public string? tenant_id { get; set; }
	public string home_id { get; set; } = null!;
	public string? schedule_id { get; set; }
	public string? name { get; set; }
	public string schedule_type { get; set; } = null!;
	public string? ActionType { get; set; } = null!;
	public ActionData? ActionData { get; set; } = null!;
	public float? cooling_away_temp { get; set; }
	public List<Timetable> timetable { get; set; } = null!;
	public List<Zone> zones { get; set; } = null!;
	public List<TimetableSunType>? timetable_sunrise { get; set; } //added
	public List<TimetableSunType>? timetable_sunset { get; set; } //added
}
public class ActionData
{
	public int? ZoneId { get; set; }
	public int? MOffset { get; set; }
	public string? DateTimeStart { get; set; }
	public string? DateTimeEnd { get; set; }
	public string[]? Days { get; set; }
	public string? TimeOfDay { get; set; }
}
public class Room
{
	public string? id { get; set; }
	public string? cooling_setpoint_mode { get; set; }
	public float? cooling_setpoint_temperature { get; set; }
}
public class Timetable
{
	public int zone_id { get; set; }
	public int m_offset { get; set; }
}

public class Zone
{
	public string? name { get; set; }
	public int id { get; set; }
	public int type { get; set; }
	public List<Room>? rooms { get; set; }
	public List<Module>? modules { get; set; }
	public List<string>? scenarios { get; set; }
}

public class Module
{
	public string? id { get; set; }
	public string? bridge { get; set; }
	public bool? on { get; set; }
	public int? target_position { get; set; }
	public int? brightness { get; set; }
	public string? fan_mode { get; set; }
	public int? fan_speed { get; set; }
}
