using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.ValidateNewHomeScheduleCooling;
public class ValidateNewHomeScheduleCoolingHandler : ICommandHandler<ValidateNewHomeScheduleCoolingCommand, ValidateNewHomeScheduleCoolingResult>
{
    public ValidateNewHomeScheduleCoolingHandler()
    {
    }

    public Task<ValidateNewHomeScheduleCoolingResult> Handle(ValidateNewHomeScheduleCoolingCommand request, CancellationToken cancellationToken)
    {
		if (request.Template == null)
		{
			throw NetatmoException.NTM005("Invalid template");
		}
		string[] weekDays = { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" };
		string[] weekEndDays = { "Saturday", "Sunday" };
		bool isOverMonday = false;
		List<TimeTableTemplate> listTime = new List<TimeTableTemplate>();
		for (int i = 0; i < request.Template.Count; i++)
		{
			VaidateTemplate(request, i);

			if (request.Template.Count != 6) continue;
			if (i < 3)
			{
				foreach (string day in weekDays)
				{
					int offsetStart = CalDateTimeToOffset(request.Template[i].StartTime, day);
					int offsetEnd = CalDateTimeToOffset(request.Template[i].EndTime, day);
					if (i == 0)
					{
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 0,
							m_offset = offsetStart,
						});
                        if (day == "Monday" && request.Template[5].IsHome == false) {
							int offsetStartBackSunday = CalDateTimeToOffset(request.Template[5].StartTime, "Monday");
                            int offsetEndtBackSunday = CalDateTimeToOffset(request.Template[5].EndTime, "Monday");
							if (offsetStartBackSunday >= offsetEndtBackSunday) {
								offsetEndtBackSunday = CalDateTimeToOffset(request.Template[5].EndTime, "Tuesday");
							}
							if (offsetEndtBackSunday >= offsetStart) {
								isOverMonday = true;
								if (offsetStart >= offsetEnd) continue;
							}
                        }						
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 1,
							m_offset = offsetEnd,
						});
						if (offsetStart >= offsetEnd && day == "Friday")
						{
							offsetEnd = CalDateTimeToOffset(request.Template[i].EndTime, "Saturday");
							listTime.Add(new TimeTableTemplate
							{
								zone_id = 1,
								m_offset = offsetEnd,
							});
						}
					}
					else if (i == 1 && request.Template[i].IsHome == false)
					{
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 2,
							m_offset = offsetStart,
						});
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 0,
							m_offset = offsetEnd,
						});
					}
					else if (i == 2 && request.Template[i].IsHome == true && request.Template[i - 1].IsHome == false)
					{
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 0,
							m_offset = offsetStart,
						});
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 2,
							m_offset = offsetEnd,
						});
					}
				}
			}
			else
			{
				bool isSundayNotHomeOvernight = false;
				if (request.Template[5].IsHome == false)
				{
					int offsetStartSunday = CalDateTimeToOffset(request.Template[5].StartTime, weekEndDays[1]);
					int offsetEndSunday = CalDateTimeToOffset(request.Template[5].EndTime, weekEndDays[1]);
					if (offsetStartSunday >= offsetEndSunday) {
						isSundayNotHomeOvernight = true;
					}
				}
				
				foreach (string day in weekEndDays)
				{
					int offsetStartWeekEnd = CalDateTimeToOffset(request.Template[3].StartTime, day);
					int offsetEndtWeekEnd = CalDateTimeToOffset(request.Template[3].EndTime, day);
					if (i == 3)
					{
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 0,
							m_offset = offsetStartWeekEnd,
						});
						if (day == "Saturday")
						{
							if (offsetStartWeekEnd >= offsetEndtWeekEnd)
							{
								offsetEndtWeekEnd = CalDateTimeToOffset(request.Template[i].EndTime, "Sunday");
							}
						}
						else
						{
							if (offsetStartWeekEnd >= offsetEndtWeekEnd && isOverMonday == true)
							{
								offsetEndtWeekEnd = CalDateTimeToOffset(request.Template[i].EndTime, "Monday");
							}
						}

						listTime.Add(new TimeTableTemplate
						{
							zone_id = 1,
							m_offset = offsetEndtWeekEnd,
						});
					}
					else if (i == 4 && request.Template[i].IsHome == false)
					{
						if (day != "Saturday") continue;
						int offsetStart = CalDateTimeToOffset(request.Template[i].StartTime, weekEndDays[i - 4]);
						int offsetEnd = CalDateTimeToOffset(request.Template[i].EndTime, weekEndDays[i - 4]);
						if (offsetStart >= offsetEnd) {
							offsetEnd = CalDateTimeToOffset(request.Template[i].EndTime, "Sunday");
						}
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 2,
							m_offset = offsetStart,
						});
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 0,
							m_offset = offsetEnd,
						});
					}

					else if (i == 5 && request.Template[i].IsHome == false)
					{
						if (day != "Sunday") continue;
						int offsetStart = CalDateTimeToOffset(request.Template[i].StartTime, weekEndDays[i - 4]);
						int offsetEnd = CalDateTimeToOffset(request.Template[i].EndTime, weekEndDays[i - 4]);
						if (offsetStartWeekEnd >= offsetEndtWeekEnd && isSundayNotHomeOvernight == true)
						{
							offsetEnd = CalDateTimeToOffset(request.Template[i].EndTime, "Monday");
							listTime.Add(new TimeTableTemplate
							{
								zone_id = 2,
								m_offset = 0,
							});
						}
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 2,
							m_offset = offsetStart,
						});
						listTime.Add(new TimeTableTemplate
						{
							zone_id = 0,
							m_offset = offsetEnd,
						});
					}
				}
			}
		}

		if (listTime.Count > 0) listTime = SortAndCheckDuplicate(ref listTime);

		if (listTime.Count > 0 && listTime[0].m_offset != 0) {
			var lastZone = listTime[listTime.Count - 1].zone_id.Value;
			var firstZone = listTime[0].zone_id.Value;
			if (lastZone != firstZone && listTime[0].m_offset.Value != 0) {
				listTime.Insert(0, new TimeTableTemplate
				{
					m_offset = 0,
					zone_id = lastZone
				});
			} else {
				listTime[0].m_offset = 0;
			}
		}

		return Task.FromResult(new ValidateNewHomeScheduleCoolingResult
		{
			Timetable = listTime
		});
	}

	private static void VaidateTemplate(ValidateNewHomeScheduleCoolingCommand request, int i)
	{
		if (i == 0)
		{
			if (request.Template[i].StartTime == request.Template[i].EndTime)
			{
				throw NetatmoException.NTM005("start and end time cannot be the same.");
			}
		}
		else if (i == 1 && request.Template[i].IsHome == false)
		{
			TimeSpan startTime = TimeSpan.Parse(request.Template[i].StartTime);
        	TimeSpan endTime = TimeSpan.Parse(request.Template[i].EndTime);
			TimeSpan newEndTime = endTime;
			if (startTime > endTime) {
				newEndTime = newEndTime.Add(TimeSpan.FromDays(1));
			}
			if (request.Template[i].StartTime == null || request.Template[i].EndTime == null)
			{
				throw NetatmoException.NTM005("should have start and end time.");
			}
			else if (request.Template[i].StartTime == request.Template[i].EndTime)
			{
				throw NetatmoException.NTM005("start and end time cannot be the same.");
			}
			else if (CheckTimeBetween(request.Template[0].StartTime, request.Template[0].EndTime, request.Template[i].StartTime) < 0)
			{
				throw NetatmoException.NTM005("go out time should more than wake up time.");
			}
			else if (CheckTimeBetween(request.Template[0].StartTime, request.Template[0].EndTime, newEndTime.ToString()) < 0)
			{
				throw NetatmoException.NTM005("come back time should more than go out time.");
			}
		}
		else if (i == 2 && request.Template[i].IsHome == true && request.Template[i - 1].IsHome == false)
		{
			TimeSpan startTime = TimeSpan.Parse(request.Template[i].StartTime);
        	TimeSpan endTime = TimeSpan.Parse(request.Template[i].EndTime);
			TimeSpan newEndTime = endTime;
			if (startTime > endTime) {
				newEndTime = newEndTime.Add(TimeSpan.FromDays(1));
			}
			if (request.Template[i].StartTime == null || request.Template[i].EndTime == null)
			{
				throw NetatmoException.NTM005("should have start and end time.");
			}
			else if (request.Template[i].StartTime == request.Template[i].EndTime)
			{
				throw NetatmoException.NTM005("start and end time cannot be the same.");
			}
			else if (CheckTimeBetween(request.Template[1].StartTime, request.Template[1].EndTime, request.Template[i].StartTime) < 0)
			{
				throw NetatmoException.NTM005("lunch time should more than wake up time and lunch time should between go out time and come back time.");
			}
			else if (CheckTimeBetween(request.Template[1].StartTime, request.Template[1].EndTime, newEndTime.ToString()) < 0)
			{
				throw NetatmoException.NTM005("lunch time should more than wake up time and lunch time should between go out time and come back time.");
			} else if (newEndTime < startTime) {
				throw NetatmoException.NTM005("come back time before go out time.");
			}
		}
		else if (i == 3)
		{
			if (request.Template[i].StartTime == request.Template[i].EndTime)
			{
				throw NetatmoException.NTM005("start and end time cannot be the same.");
			}
		}
		else if ((i == 4 || i == 5) && request.Template[i].IsHome == false)
		{
			TimeSpan startTime = TimeSpan.Parse(request.Template[i].StartTime);
        	TimeSpan endTime = TimeSpan.Parse(request.Template[i].EndTime);
			TimeSpan newEndTime = endTime;
			if (startTime > endTime) {
				newEndTime = newEndTime.Add(TimeSpan.FromDays(1));
			}
			if (request.Template[i].StartTime == null || request.Template[i].EndTime == null)
			{
				throw NetatmoException.NTM005("should have start and end time.");
			}
			else if (request.Template[i].StartTime == request.Template[i].EndTime)
			{
				throw NetatmoException.NTM005("start and end time cannot be the same.");
			}
			else if (CheckTimeBetween(request.Template[3].StartTime, request.Template[3].EndTime, request.Template[i].StartTime) < 0)
			{
				throw NetatmoException.NTM005("go out time should more than wake up time.");
			}
			else if (CheckTimeBetween(request.Template[3].StartTime, request.Template[3].EndTime, newEndTime.ToString()) < 0)
			{
				throw NetatmoException.NTM005("come back time should more should before sleep time.");
			}
		}
	}

	private static List<TimeTableTemplate> SortAndCheckDuplicate(ref List<TimeTableTemplate> listTime)
	{
		listTime = listTime.OrderBy(entry => entry.m_offset).ToList();
		List<TimeTableTemplate> realTimeTable = new List<TimeTableTemplate>();
		if (listTime.Count > 0)
		{
			int lastZone = listTime[0].zone_id.Value;
			int lastOffest = listTime[0].m_offset.Value;
			int indexStart = 1;
			if (listTime[1].m_offset.Value == listTime[0].m_offset.Value) {
				realTimeTable.Add(new TimeTableTemplate{
					m_offset = listTime[1].m_offset,
					zone_id = listTime[1].zone_id
				});
				indexStart = 2;
				lastZone = listTime[1].zone_id.Value;
				lastOffest = listTime[1].m_offset.Value;
			} else {
				realTimeTable.Add(listTime[0]);
			}
			
			for (var i = indexStart; i < listTime.Count; i++)
			{
				if (listTime[i].zone_id == lastZone || listTime[i].m_offset == lastOffest) continue;
				realTimeTable.Add(listTime[i]);
				lastOffest = listTime[i].m_offset.Value;
				lastZone = listTime[i].zone_id.Value;
			}
		}

		return realTimeTable;
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

	static int CheckTimeBetween(string startTime, string endTime, string checkTime)
    {
        TimeSpan start = TimeSpan.Parse(startTime);
        TimeSpan end = TimeSpan.Parse(endTime);
        TimeSpan check = TimeSpan.Parse(checkTime);

		if (end < start) {
			end = end.Add(TimeSpan.FromDays(1));
		}

        if (check > start && check < end)
        {
            return 0; 
        }

        return -1;
    }
}