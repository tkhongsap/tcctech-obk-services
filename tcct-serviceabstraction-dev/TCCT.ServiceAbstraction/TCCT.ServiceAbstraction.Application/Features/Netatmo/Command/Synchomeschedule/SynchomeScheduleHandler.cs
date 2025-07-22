using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeSchedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
public class SynchomeScheduleHandler : ICommandHandler<SynchomeScheduleCommand, SynchomeScheduleResult>
{
	private readonly INetatmoService _netatmoService;
	public SynchomeScheduleHandler(INetatmoService netatmoService)
	{
		_netatmoService = netatmoService;
	}
	public async Task<SynchomeScheduleResult> Handle(SynchomeScheduleCommand request, CancellationToken cancellationToken)
	{
		if (request.ActionType != null)
		{
			if (request.schedule_type == "cooling") {
				CalculateTimetableCooling(request);
			} else if (request.schedule_type == "event" ) {
				CalculateTimetableEvent(request);
			}
		}

		var m = request.zones.Select(z => z.modules);
		foreach (var module in m)
		{
			if (module != null)
			{
				for (int i = 0; i < module.Count; i++)
				{
					if (module[i].fan_speed > 3 || module[i].fan_speed < 0)
					{
						throw NetatmoException.NTM005("the fan speed value must be between 0 and 3");
					}
					if (module[i].brightness < 0 || module[i].brightness > 100)
					{
						throw NetatmoException.NTM005("the brightness value must be between 0 and 100");
					}
				}
			}
		}
		return await _netatmoService.SetSynchomeschedule(request.home_id,
			request.schedule_id,
			request.name,
			request.schedule_type,
			request.cooling_away_temp,
			request.timetable_sunrise,
			request.timetable_sunset,
			request.timetable,
			request.zones,
			request.tenant_id);
	}
	private static void CalculateTimetableEvent(SynchomeScheduleCommand request)
	{
		if (request.ActionData == null || request.ActionData.Days == null || request.ActionData.TimeOfDay == null || request.ActionData.ZoneId == null) {
			throw NetatmoException.NTM010("should have data days, time and zone");
		}
		List<Timetable> reqestTimeTable = new List<Timetable>();
		if (request.ActionType == "add" || request.ActionType == "edit") {
			List<Timetable> tableCheckTime = new List<Timetable>();
			foreach (var day in request.ActionData.Days)
			{
				int timeOffset = CalDateTimeToOffset(request.ActionData.TimeOfDay, day);
				tableCheckTime.Add(new Timetable{
					m_offset = timeOffset,
					zone_id = request.ActionData.ZoneId ?? 0
				});
			}
			 
			reqestTimeTable = MergeRemoveDuplicatesAndSortTimetables(tableCheckTime, request.timetable);
		} else if (request.ActionType == "delete") {
			Dictionary<string, int> tableCheckTime = new Dictionary<string, int>();
			foreach (var day in request.ActionData.Days)
			{
				int timeOffset = CalDateTimeToOffset(request.ActionData.TimeOfDay, day);
				tableCheckTime.Add($"{timeOffset}{request.ActionData.ZoneId}", timeOffset);
			}
			foreach (var data in request.timetable) {
				if (tableCheckTime.ContainsKey($"{data.m_offset}{data.zone_id}")) continue;
				reqestTimeTable.Add(new Timetable
				{
					zone_id = data.zone_id,
					m_offset = data.m_offset
				});
			}
		}

		request.timetable = reqestTimeTable;
	}

	private static void CalculateTimetableCooling(SynchomeScheduleCommand request)
	{
		if (request.schedule_type == "cooling" && request.timetable.Count == 1)
		{
			if (request.ActionType == "delete")
			{
				throw NetatmoException.NTM009("this timeslot cannot be deleted. At least one timeslot must be configured in your schedule.");
			}
			if (request.ActionType == "edit")
			{
				throw NetatmoException.NTM002("timeslot need to start at 00:00 at Monday");
			}
		}

		List<Timetable> reqestTimeTable = new List<Timetable>();
		if (request.ActionType == "add" || request.ActionType == "edit")
		{
			if (request.ActionData == null || request.ActionData.ZoneId == null || request.ActionData.DateTimeStart == null || request.ActionData.DateTimeEnd == null)
			{
				throw NetatmoException.NTM010($"should have data for {request.ActionType}.");
			}

			if (request.ActionData.MOffset == null && request.ActionType == "edit")
			{
				throw NetatmoException.NTM010($"should have offset for {request.ActionType}.");
			}

			int? zoneIdChange = request.ActionData.ZoneId;
			var (offsetStart, dayStart) = CalculateMinutesFromStartOfWeek(request.ActionData!.DateTimeStart!);
			var (offsetEnd, dayEnd) = CalculateMinutesFromStartOfWeek(request.ActionData.DateTimeEnd!);
			List<Timetable> listWithStart = new List<Timetable>();
			int lastIndex = 0;
			bool isOffsetNormal = true;
			if (offsetEnd < offsetStart)
			{
				isOffsetNormal = false;
				if (dayStart == dayEnd)
				{
					throw NetatmoException.NTM010($"if day end is before day start, day start and day end should not be the same.");
				}
			}
			if (request.timetable.Count > 0) {
				reqestTimeTable = UpsertTimeSlot(request, zoneIdChange, offsetStart, offsetEnd, listWithStart, ref lastIndex, isOffsetNormal);
			}
		}
		else if (request.ActionType == "delete")
		{
			DeleteTimeSlot(request, reqestTimeTable);
		}

		List<Timetable> realTimeTable = new List<Timetable>();
		if (reqestTimeTable.Count > 0)
		{
			realTimeTable.Add(reqestTimeTable[0]);
			int lastZone = reqestTimeTable[0].zone_id;
			for (var i = 1; i < reqestTimeTable.Count; i++)
			{
				if (reqestTimeTable[i].zone_id == lastZone) continue;
				realTimeTable.Add(reqestTimeTable[i]);
				lastZone = reqestTimeTable[i].zone_id;
			}
		}
		request.timetable = realTimeTable;
	}

	private static List<Timetable> UpsertTimeSlot(SynchomeScheduleCommand request, int? zoneIdChange, int offsetStart, int offsetEnd, List<Timetable> listWithStart, ref int lastIndex, bool isOffsetNormal)
	{
		List<Timetable> reqestTimeTable;
		{
			if (isOffsetNormal)
			{
				if (offsetStart != 0) listWithStart.Add(request.timetable[0]);
				for (var i = 1; i < request.timetable.Count; i++)
				{
					lastIndex = i;
					if ((offsetStart > request.timetable[i - 1].m_offset && offsetStart <= request.timetable[i].m_offset) || (offsetStart == 0 && i == 1))
					{
						if (request.timetable[i - 1].zone_id == zoneIdChange && offsetStart != 0) continue;
						listWithStart.Add(new Timetable
						{
							m_offset = offsetStart,
							zone_id = zoneIdChange ?? 0
						});
						break;
					}
					else
					{
						listWithStart.Add(request.timetable[i]);
					}
				}
			}
			else
			{
				listWithStart.Add(new Timetable
				{
					m_offset = 0,
					zone_id = zoneIdChange ?? 0
				});
				for (var i = 1; i < request.timetable.Count; i++)
				{
					if (offsetEnd > request.timetable[i - 1].m_offset && offsetEnd <= request.timetable[i].m_offset)
					{
						if (request.timetable[i].m_offset != offsetEnd)
						{
							listWithStart.Add(new Timetable
							{
								m_offset = offsetEnd,
								zone_id = request.timetable[i - 1].zone_id
							});
						}
						lastIndex = i;
						listWithStart.Add(request.timetable[i]);
						break;
					}
				}
			}


			if (!isOffsetNormal)
			{
				reqestTimeTable = listWithStart;
				for (var i = lastIndex; i < request.timetable.Count; i++)
				{
					if (offsetStart > request.timetable[i - 1].m_offset && offsetStart <= request.timetable[i].m_offset)
					{
						reqestTimeTable.Add(new Timetable
						{
							m_offset = offsetStart,
							zone_id = zoneIdChange ?? 0
						});
						break;
					} else {
						reqestTimeTable.Add(request.timetable[i]);
						if (i == request.timetable.Count - 1)
						{
							reqestTimeTable.Add(new Timetable
							{
								m_offset = offsetStart,
								zone_id = zoneIdChange ?? 0
							});
						}
					}
				}
			}
			else
			{
				reqestTimeTable = listWithStart;
				if (listWithStart.Count == request.timetable.Count)
				{
					reqestTimeTable.Add(new Timetable
					{
						m_offset = offsetStart,
						zone_id = zoneIdChange ?? 0
					});
					reqestTimeTable.Add(new Timetable
					{
						m_offset = offsetEnd,
						zone_id = request.timetable[0].zone_id
					});
				}
				else
				{
					bool addEnd = false;
					for (var i = lastIndex; i < request.timetable.Count; i++)
					{
						if (offsetEnd > request.timetable[i - 1].m_offset && offsetEnd <= request.timetable[i].m_offset)
						{
							if (offsetEnd != request.timetable[i].m_offset)
							{
								reqestTimeTable.Add(new Timetable
								{
									m_offset = offsetEnd,
									zone_id = request.timetable[i - 1].zone_id
								});
							}
							addEnd = true;
						}
						else if (i == request.timetable.Count - 1 && offsetEnd > request.timetable[i].m_offset)
						{
							reqestTimeTable.Add(new Timetable
							{
								m_offset = offsetEnd,
								zone_id = request.timetable[i].zone_id
							});
						}
						if (addEnd)
						{
							reqestTimeTable.Add(request.timetable[i]);
						}
					}
				}
			}
		}

		return reqestTimeTable;
	}

	private static void DeleteTimeSlot(SynchomeScheduleCommand request, List<Timetable> reqestTimeTable)
	{
		if (request.ActionData == null || request.ActionData.ZoneId == null || request.ActionData.MOffset == null)
		{
			throw NetatmoException.NTM010("should have data for delete.");
		}
		int? lastZone = null;
		int? lastOffest = null;
		bool sameFirstLast = false;
		int? offestCheck = request.ActionData.MOffset;
		if (request.timetable[request.timetable.Count - 1].zone_id == request.timetable[0].zone_id && (request.timetable[request.timetable.Count - 1].m_offset == offestCheck || request.timetable[0].m_offset == offestCheck) && request.timetable[0].zone_id == request.ActionData.ZoneId)
		{
			offestCheck = 0;
			sameFirstLast = true;
		}
		for (var i = 0; i < request.timetable.Count; i++)
		{
			if (lastZone != null && request.timetable[i].zone_id == lastZone) continue;
			if (request.timetable[i].zone_id == request.ActionData.ZoneId && request.timetable[i].m_offset == offestCheck)
			{
				lastOffest = request.timetable[i].m_offset;
			}
			else
			{
				if (lastOffest != null)
				{
					reqestTimeTable.Add(new Timetable
					{
						m_offset = lastOffest.Value,
						zone_id = request.timetable[i].zone_id
					});
					lastOffest = null;
				}
				else
				{
					if (sameFirstLast && i == request.timetable.Count - 1)
					{
						reqestTimeTable.Add(new Timetable
						{
							m_offset = request.timetable[i].m_offset,
							zone_id = request.timetable[1].zone_id
						});
						break;
					}
					reqestTimeTable.Add(request.timetable[i]);
				}
			}

			lastZone = request.timetable[i].zone_id;
		}
	}

	public static (int, int) CalculateMinutesFromStartOfWeek(string dateTimeString)
	{
		string[] dateTime = dateTimeString.Split(' ');
		string dateString = dateTime[0];
		string[] timeString = dateTime[1].Split(':');
		int hours = int.Parse(timeString[0]) * 60;
		int minutes = int.Parse(timeString[1]);
		InitialTimeTable(out Dictionary<string, int> dayToIntMap, out int minutesInDay);
		return ((dayToIntMap[dateString] * minutesInDay) + hours + minutes, dayToIntMap[dateString]);
	}

	private static int CalDateTimeToOffset(string time, string day)
	{
		InitialTimeTable(out Dictionary<string, int> dayToIntMap, out int minutesInDay);
		string[] timeString = time.Split(':');
		int hours = int.Parse(timeString[0]) * 60;
		int minutes = int.Parse(timeString[1]);
		int offest = (dayToIntMap[day] * minutesInDay) + hours + minutes;
		return offest;
	}

	private static void InitialTimeTable(out Dictionary<string, int> dayToIntMap, out int minutesInDay)
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

	public static List<Timetable> MergeRemoveDuplicatesAndSortTimetables(List<Timetable> timetable, List<Timetable> timetableMaster)
    {
        var seenOffsets = new HashSet<int>();
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
