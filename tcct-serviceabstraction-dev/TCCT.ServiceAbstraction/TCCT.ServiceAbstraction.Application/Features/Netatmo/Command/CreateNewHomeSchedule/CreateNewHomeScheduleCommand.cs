using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
public class CreateNewHomeScheduleCommand : ICommand<CreateNewHomeScheduleResult>
{
	public string? tenant_id { get; set; }
	public string? id { get; set; }
	public string? name { get; set; }
	public int away_temp { get; set; }
	public int hg_temp { get; set; }
	public List<TimeTableType>? timetable { get; set; } //Completed
	public List<ZoneType>? zones { get; set; } //Completed
	public string? schedule_type { get; set; }
	public float cooling_away_temp { get; set; }
	public bool selected { get; set; }
	public List<TimetableSunType>? timetable_sunrise { get; set; } //Completed
	public List<TimetableSunType>? timetable_sunset { get; set; } //Completed
	public int? power_threshold { get; set; }
	public string? contract_power_nit { get; set; }
	public string? tariff { get; set; }
	public string? tariff_option { get; set; }
	public string? operation { get; set; }
	public ActionData? ActionData { get; set; } = null!;
}

public class TimeTableType
{
	public int? m_offset { get; set; }
	public int? zone_id { get; set; }
}

public class ZoneType
{
	public string? name { get; set; }
	public int? type { get; set; }
	public int? id { get; set; }
	public List<RoomType>? rooms { get; set; }
	public List<ModuleType>? modules { get; set; }
	public List<string>? scenarios { get; set; }
}

public class RoomType
{
	public string? id { get; set; }
	public string? therm_setpoint_fp { get; set; }
	public string? cooling_setpoint_mode { get; set; }
	public float? cooling_setpoint_temperature { get; set; }
}
public class ModuleType
{
	public string? id { get; set; }
	public string? bridge { get; set; }
	public bool? on { get; set; }
	public int? target_position { get; set; }
	public int? brightness { get; set; }
	public string? fan_mode { get; set; }
	public int? fan_speed { get; set; }
}
public class TimetableSunType
{
	public int? zone_id { get; set; }
	public int? day { get; set; }
	public int? twilight_offset { get; set; }
}

public class ActionData
{
	public int? ZoneId { get; set; }
	public string[]? Days { get; set; }
	public string? TimeOfDay { get; set; }
}