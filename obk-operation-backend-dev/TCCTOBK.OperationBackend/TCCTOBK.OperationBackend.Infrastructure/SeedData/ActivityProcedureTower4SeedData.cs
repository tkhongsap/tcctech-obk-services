using System;
using System.Text.Encodings.Web;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActivityProcedureTower4SeedData
{
    public static List<trActivityProcedure> GenerateActivityProcedureTower4()
    {
        var activityProcedureTower4 = new List<trActivityProcedure>();
        var subtask = new Dictionary<string, string>()
        {
            {"P-สังเกตการณ์รอบพื้นที่", "b6f1c810-aa59-47d3-b8b3-eede3007da19"},
        };
        var list_map_title = new Dictionary<string, List<string>>() 
        {
        {
            "Tower 4 Guard Tour Points - Level 1 Lobby - 1",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level B2 Office B2 - 1",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level B2 Office B2 - 2",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level B2 Office B2 - 3",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }   
        },
        {
            "Tower 4 Guard Tour Points - Level B1 - 1",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level B1 - 2",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level B1 - 3",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level BM - 1",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level BM - 2",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level BM - 3",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level G - 1",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level G - 2",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
        {
            "Tower 4 Guard Tour Points - Level G - 3",
            new List < string > () {
                "P-สังเกตการณ์รอบพื้นที่",
            }
        },
    };
        var code = "TOWER4";
        for (int i = 1; i <= 1; i++)
        {
            var subact = new List<object>();
            foreach(var item in list_map_title)
            {
                var actionsId = new List<Guid>();
                foreach(var sub in item.Value)
                {
                    actionsId.Add(new Guid(subtask[sub]));
                }
                var obj = new
                {
                    name = item.Key,
                    actions = actionsId
                };
                subact.Add(obj);
            }
            activityProcedureTower4.Add(new trActivityProcedure
            {
                Id = Guid.NewGuid(),
                Code = i < 10 ? $"{code}00{i}" : $"{code}0{i}",
                TaskName = $"Tower 4 Guard Tour Route {i}",
                SubtaskActions = JsonSerializer.Serialize(subact, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    AllowTrailingCommas = true 
                }),
                LocationId = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3e"),
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now
            });
        }
        return activityProcedureTower4;
    }
}
