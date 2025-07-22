using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
public class CreateNewHomeScheduleHandler : ICommandHandler<CreateNewHomeScheduleCommand, CreateNewHomeScheduleResult>
{
	private readonly INetatmoService _netatmoservice;
	public CreateNewHomeScheduleHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public Task<CreateNewHomeScheduleResult> Handle(CreateNewHomeScheduleCommand request, CancellationToken cancellationToken)
	{
		switch (request.operation)
		{
			case "heating":
				return _netatmoservice.CreateNewHomeSchedule(request.id!, request.name, request.away_temp, request.hg_temp, request.timetable, request.zones, request.tenant_id);
			case "heating event":
				return _netatmoservice.CreateNewHomeSchedule(request.id!, request.name, request.schedule_type, request.timetable, request.zones, request.tenant_id);
			case "cooling":
				var m = request.zones.Select(z => z.modules);
				foreach(var module in m)
				{
					if (module != null)
					{
						for(int i = 0; i < module.Count; i++)
						{
							if (module[i].fan_speed > 3 || module[i].fan_speed < 0)
							{
								throw NetatmoException.NTM005("the fan speed value must be between 0 and 3");
							}
						}
					}
				}
				
				return _netatmoservice.CreateNewHomeSchedule(request.id!, request.name, request.cooling_away_temp, request.schedule_type, request.selected, request.timetable, request.zones, request.tenant_id);
			case "action":
				CalculateTimetableEvent(request);
				return _netatmoservice.CreateNewHomeSchedule(request.id!, request.name, request.schedule_type, request.timetable, request.zones, request.timetable_sunrise, request.timetable_sunset, request.tenant_id);
			default:
				throw NetatmoException.NTM005("Invalid operation");
		}
	}


	private static void CalculateTimetableEvent(CreateNewHomeScheduleCommand request)
	{
		if (request.ActionData != null && (request.ActionData.Days == null || request.ActionData.TimeOfDay == null || request.ActionData.ZoneId == null)) {
			throw NetatmoException.NTM010("should have data days, time and zone");
		}
		if (request.ActionData != null) {
			List<TimeTableType> tableCheckTime = new List<TimeTableType>();
			foreach (var day in request.ActionData.Days)
			{
				int timeOffset = CalDateTimeToOffset(request.ActionData.TimeOfDay, day);
				tableCheckTime.Add(new TimeTableType{
					m_offset = timeOffset,
					zone_id = request.ActionData.ZoneId ?? 0
				});
			}
				
			request.timetable = MergeRemoveDuplicatesAndSortTimetables(tableCheckTime, request.timetable ?? new List<TimeTableType>());
		}
	}

	public static int CalDateTimeToOffset(string time, string day)
	{
		InitialTimeTable(out Dictionary<string, int> dayToIntMap, out int minutesInDay);
		string[] timeString = time.Split(':');
		int hours = int.Parse(timeString[0]) * 60;
		int minutes = int.Parse(timeString[1]);
		int offest = (dayToIntMap[day] * minutesInDay) + hours + minutes;
		return offest;
	}

	public static void InitialTimeTable(out Dictionary<string, int> dayToIntMap, out int minutesInDay)
	{
		dayToIntMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
		{
			{ "Monday", 0 },
			{ "Tuesday", 1 },
			{ "Wednesday", 2 },
			{ "Thursday", 3 },
			{ "Friday", 4 },
			{ "Saturday", 5 },
			{ "Sunday", 6 }
		};
		minutesInDay = 1440;
	}

	public static List<TimeTableType> MergeRemoveDuplicatesAndSortTimetables(List<TimeTableType> timetable, List<TimeTableType> timetableMaster)
    {
        var seenOffsets = new HashSet<int?>();
        foreach (var item in timetable)
        {
            seenOffsets.Add(item.m_offset);
        }

        var uniqueTimetable1 = timetableMaster
            .Where(item => seenOffsets.Add(item.m_offset))
            .ToList();

        var combinedList = timetable.Concat(uniqueTimetable1).ToList();
        var sortedList = combinedList.OrderBy(item => item.m_offset).ToList();

        return sortedList;
    }
}