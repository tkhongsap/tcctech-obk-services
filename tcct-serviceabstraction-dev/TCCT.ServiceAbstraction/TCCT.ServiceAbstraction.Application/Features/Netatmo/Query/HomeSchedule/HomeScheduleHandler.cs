using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeSchedule;
public class HomeScheduleHandler : IQueryHandler<HomeScheduleQuery, HomeScheduleResult>
{
	private readonly INetatmoService _netatmoservice;
	public HomeScheduleHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<HomeScheduleResult> Handle(HomeScheduleQuery request, CancellationToken cancellationToken)
	{
		var homeSchedule = await _netatmoservice.GetHomeData(request.HomeId, request.TenantId);
		var homes = new List<Home>();
		foreach (var h in homeSchedule.body.homes)
		{
			var dicRoom = new Dictionary<string, HomeData.Room>{};
			foreach (var room in h.rooms) {
				dicRoom.Add(room.id, room);
			}
			var dicModule = new Dictionary<string, HomeData.Module>{};
			foreach (var module in h.modules) {
				dicModule.Add(module.id, module);
			}
			var schedule = new Schedule();
			foreach (var s in h.schedules)
			{
				if (s.id == request.ScheduleId) {
					schedule = new Schedule
					{
						timetable = s.timetable,
						readable_timetable = s.type == "cooling" ? HomeScheduleHandler.CalculateReadableTimetableCooling(s.timetable, s.zones, dicRoom, dicModule) : HomeScheduleHandler.CalculateReadableTimetableAction(s.timetable, s.zones, dicRoom, dicModule),
						zones = s.zones,
						name = s.name,
						@default = s.@default,
						away_temp = s.away_temp,
						hg_temp = s.hg_temp,
						id = s.id,
						type = s.type,
						timetable_sunrise = s.timetable_sunrise,
						timetable_sunset = s.timetable_sunset,
						selected = s.selected
					};
				}
			}
			homes.Add(new Home
			{
				id = h.id,
				name = h.name,
				altitude = h.altitude,
				coordinates = h.coordinates,
				country = h.country,
				timezone = h.timezone,
				temperature_control_mode = h.temperature_control_mode,
				therm_mode = h.therm_mode,
				therm_setpoint_default_duration = h.therm_setpoint_default_duration,
				cooling_mode = h.cooling_mode,
				schedules = schedule
			});
		}
		var user = new User()
		{
			email = homeSchedule.body.user.email,
			language = homeSchedule.body.user.language,
			locale = homeSchedule.body.user.locale,
			feel_like_algorithm = homeSchedule.body.user.feel_like_algorithm,
			unit_pressure = homeSchedule.body.user.unit_pressure,
			unit_system = homeSchedule.body.user.unit_system,
			unit_wind = homeSchedule.body.user.unit_wind,
			id = homeSchedule.body.user.id
		};
		var result = new HomeScheduleResult
		{
			body = new HomeScheduleBody
			{
				homes = homes,
				user = user
			},
			status = homeSchedule.status,
			time_exec = homeSchedule.time_exec,
			time_server = homeSchedule.time_server
		};
		return result;
	}

	public static Dictionary<string, List<DayOffset>> CalculateReadableTimetableCooling(List<HomeData.Timetable> schedules, List<HomeData.Zone> zones, Dictionary<string, HomeData.Room> rooms, Dictionary<string, HomeData.Module> modules)
	{
		var dicZone = GetZonesDictionary(zones, rooms, modules);
		if (schedules.Count == 0) return new Dictionary<string, List<DayOffset>>();
		var (resultDayOffsets, minutesInDay, days) = InitializeResultDayOffsets();
		string[] fullDays = { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
		var dayOffsets = Enumerable.Range(0, 7)
			.Select(i => new DayOffset
			{
				Day = days[i],
				OffsetStart = i * minutesInDay,
				OffsetEnd = (i + 1) * minutesInDay,
				TimeReadable = "00:00",
			})
			.ToList();

		int lastZone = schedules[0].zone_id;
		CalStartEndOffset(schedules);

		int lastOffsetStart = schedules[0].m_offset_start ?? 0;
		int lastOffsetEnd = schedules[0].m_offset_end ?? 0;
		CalDateTime(minutesInDay, lastOffsetStart, out int dayIndexStart, out string timeOfDayStart);
		CalDateTime(minutesInDay, lastOffsetEnd, out int dayIndexEnd, out string timeOfDayEnd);

		for (int i = 0; i < dayOffsets.Count; i++)
		{
			int? startOffset = dayOffsets[i].OffsetStart;
			int? endOffset = dayOffsets[i].OffsetEnd;

			AddDayOffset(resultDayOffsets, days, i, dayOffsets[i].TimeReadable!, dicZone, lastZone, startOffset, fullDays, dayIndexStart, timeOfDayStart, dayIndexEnd, timeOfDayEnd);
			foreach (var schedule in schedules)
			{
				if (schedule.m_offset >= startOffset && schedule.m_offset <= endOffset)
				{
					CalDateTime(minutesInDay, schedule.m_offset, out int dayIndex, out string timeOfDay);
					lastZone = schedule.zone_id;
					lastOffsetStart = schedule.m_offset_start ?? 0;
					CalDateTime(minutesInDay, lastOffsetStart, out dayIndexStart, out timeOfDayStart);
					lastOffsetEnd = schedule.m_offset_end ?? 0;
					CalDateTime(minutesInDay, lastOffsetEnd, out dayIndexEnd, out timeOfDayEnd);
					if (timeOfDay == "00:00") continue;
					AddDayOffset(resultDayOffsets, days, dayIndex, timeOfDay, dicZone, lastZone, schedule.m_offset, fullDays, dayIndexStart, timeOfDayStart, dayIndexEnd, timeOfDayEnd);
				}
			}
		}

		return resultDayOffsets;
	}

	private static void AddDayOffset(Dictionary<string, List<DayOffset>> resultDayOffsets, string[] days, int dayIndex, string timeOfDay, Dictionary<int, HomeData.Zone> dicZone, int lastZone, int? offset, string[] fullDays, int dayIndexStart, string timeOfDayStart, int dayIndexEnd, string timeOfDayEnd)
	{
		resultDayOffsets[days[dayIndex]].Add(new DayOffset
		{
			TimeReadable = timeOfDayStart,
			ZoneName = dicZone[lastZone].name,
			ZoneId = lastZone,
			ZoneType = dicZone[lastZone].type,
			MOffset = offset,
			DateStart = fullDays[dayIndexStart],
			TimeStart = timeOfDayStart,
			DateEnd = fullDays[dayIndexEnd],
			TimeEnd = timeOfDayEnd
		});
	}


	private static void CalStartEndOffset(List<HomeData.Timetable> schedules)
	{
		if (schedules.Count == 1) {
			schedules[0].m_offset_start = schedules[0].m_offset;
			schedules[0].m_offset_end = schedules[0].m_offset;
		} else {
			if (schedules.Count > 2 && schedules[schedules.Count - 1].zone_id == schedules[0].zone_id)
			{
				schedules[0].m_offset_start = schedules[schedules.Count - 1].m_offset;
				schedules[0].m_offset_end = schedules[1].m_offset;
			}
			else
			{
				schedules[0].m_offset_start = schedules[0].m_offset;
				schedules[0].m_offset_end = schedules[1].m_offset;
			}

			for (int i = 1; i < schedules.Count - 1; i++)
			{
				schedules[i].m_offset_start = schedules[i].m_offset;
				schedules[i].m_offset_end = schedules[i + 1].m_offset;
			}

			schedules[schedules.Count - 1].m_offset_start = schedules[schedules.Count - 1].m_offset;
			if (schedules.Count > 2 && schedules[schedules.Count - 1].zone_id == schedules[0].zone_id)
			{
				schedules[schedules.Count - 1].m_offset_end = schedules[0].m_offset_end;
			}
			else
			{
				schedules[schedules.Count - 1].m_offset_end = schedules[0].m_offset_start;
			}
		}
	}

	private static void CalDateTime(int minutesInDay, int offset, out int dayIndex, out string timeOfDay)
	{
		dayIndex = offset / minutesInDay;
		int minutesOfDay = offset % minutesInDay;
		timeOfDay = TimeSpan.FromMinutes(minutesOfDay).ToString(@"hh\:mm");
	}

	public static Dictionary<string, List<DayOffset>> CalculateReadableTimetableAction(List<HomeData.Timetable> schedules, List<HomeData.Zone> zones, Dictionary<string, HomeData.Room> rooms, Dictionary<string, HomeData.Module> modules)
    {
		var dicZone = GetZonesDictionary(zones, rooms, modules);
		if (schedules.Count == 0) return new Dictionary<string, List<DayOffset>>();
		var (resultDayOffsets, minutesInDay, days) = InitializeResultDayOffsets();
		int lastZone = schedules[0].zone_id;

		foreach (var schedule in schedules)
		{
				CalDateTime(minutesInDay, schedule.m_offset, out int dayIndex, out string timeOfDay);
				lastZone = schedule.zone_id;
				resultDayOffsets[days[dayIndex]].Add(new DayOffset
				{
					TimeReadable = timeOfDay,
					MOffset = schedule.m_offset,
					ZoneId = lastZone,
				});
		}

		return resultDayOffsets;
    }

	private static (Dictionary<string, List<DayOffset>> resultDayOffsets, int minutesInDay, string[] days) InitializeResultDayOffsets()
	{
		string[] days = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
		int minutesInDay = 1440;

		var resultDayOffsets = Enumerable.Range(0, 7).ToDictionary(
			i => days[i],
			i => new List<DayOffset>()
		);

		return (resultDayOffsets, minutesInDay, days);
	}

	public static Dictionary<int, HomeData.Zone> GetZonesDictionary(List<HomeData.Zone> zones, Dictionary<string, HomeData.Room> rooms, Dictionary<string, HomeData.Module> modules)
	{
		var dicZone = new Dictionary<int, HomeData.Zone> {};
		foreach (var s in zones) {
			var data = s;
			var roomResult = s.rooms;
			if (roomResult != null) {
				for (int i = 0; i < s.rooms.Count; i++)
				{
					var roomData = s.rooms[i];
					var roomName = rooms[roomData.id];
					roomResult[i].name = roomName.name;
				}
			}
			s.rooms = roomResult;
			var moduleResult = s.modules;
			if (moduleResult != null) {
				for (int i = 0; i < s.modules.Count; i++)
				{
					var moduleData = s.modules[i];
					var moduleName = modules[moduleData.id];
					moduleResult[i].name = moduleName.name;
					var modulesData = modules[moduleData.id];
					moduleResult[i].room_name =  rooms[modulesData.room_id].name;
					moduleResult[i].type = modulesData.type;
				}
			}
			s.modules = moduleResult;
			dicZone.Add(s.id, s);
		}

		return dicZone;
	}
}
