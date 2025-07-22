using System;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class SchedulePlanSeedTower4Data
{
    public static List<trSchedulePlan> GenerateSchedulePlanTower4()
    {
        var schedulePlan = new List<trSchedulePlan>();
        var daily = new List<string> { "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" };
        var startTime = new List<TimeSpan>
        {
            new TimeSpan(10, 0, 0),
            new TimeSpan(1, 0, 0),
            new TimeSpan(4, 0, 0),
        };
        var endTime = new List<TimeSpan>()
        {
            new TimeSpan(11, 0, 0),
            new TimeSpan(2, 0, 0),
            new TimeSpan(5, 0, 0),
        };
        var code = "TOWER4";
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
                    MID = new Guid("00000000-0000-0000-0000-000000000000"),
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
