using System;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class SchedulePlanSeedTOTData
{
    public static List<trSchedulePlan> GenerateSchedulePlanTOT()
    {
        var schedulePlan = new List<trSchedulePlan>();
        var daily = new List<string> { "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" };
        var startTime = new List<TimeSpan>
        {
            new TimeSpan(9, 0, 0),
            new TimeSpan(15, 0, 0),
            new TimeSpan(21, 0, 0),
            new TimeSpan(0, 0, 0),
            new TimeSpan(3, 0, 0),
        };

        var endTime = new List<TimeSpan>()
        {
            new TimeSpan(10, 0, 0),
            new TimeSpan(16, 0, 0),
            new TimeSpan(22, 0, 0),
            new TimeSpan(1, 0, 0),
            new TimeSpan(4, 0, 0),
        };
        var code = "TOT";
        for (int i = 0; i < startTime.Count; i++)
        {
            for (int j = 1; j <= 1; j++)
            {
                var schedule = new trSchedulePlan
                {
                    Id = Guid.NewGuid(),
                    Route = j < 10 ? $"{code}00{j}" : $"{code}0{j}",
                    StartTime = startTime[i],
                    EndTime = endTime[i],
                    Frequency = JsonSerializer.Serialize(daily),
                    MID = new Guid("cdcb8424-1651-4bab-9a6b-410801dd737b"),
                    CreatedByName = "System",
                    CreatedDate = DateTime.Now,
                    CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                    UpdatedByName = "System",
                    UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                    UpdatedDate = DateTime.Now,
                };
                schedulePlan.Add(schedule);
            }
        }
        return schedulePlan;
    }
}
