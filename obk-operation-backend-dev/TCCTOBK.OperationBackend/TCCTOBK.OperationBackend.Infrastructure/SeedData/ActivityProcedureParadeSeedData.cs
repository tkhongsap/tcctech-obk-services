using System;
using System.Text.Encodings.Web;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActivityProcedureParadeSeedData
{
    public static List<trActivityProcedure> GenerateActivityProcedureParade()
    {
        var activityProcedureParade = new List<trActivityProcedure>();
        var subtask = new Dictionary<string, string>()
        {
            {"Inspect the escalator R2", "b6f1c810-aa59-47d3-b8b3-eede3007da07"},
            {"Inspect front of parking lift R2", "b6f1c810-aa59-47d3-b8b3-eede3007da08"},
            {"Inspect central corridor retail R2", "b6f1c810-aa59-47d3-b8b3-eede3007da09"},
            {"Inspect the fire escape staircase ST01, connecting path to Loading B1", "b6f1c810-aa59-47d3-b8b3-eede3007da10"},
            {"Inspect the corridor between Retail R2 and Retail R1 (Rotunda)", "b6f1c810-aa59-47d3-b8b3-eede3007da11"},
            {"Inspect the walkway and surrounding retail stores connected to the MRT and fire escape staircase R2", "b6f1c810-aa59-47d3-b8b3-eede3007da12"},
            {"Inspect the area around the fire escape staircase R2 and the walkway to the food section", "b6f1c810-aa59-47d3-b8b3-eede3007da13"},
            {"Inspect the escalator, the connection between MRT, and the surrounding area around the walkway", "b6f1c810-aa59-47d3-b8b3-eede3007da14"},
            {"Inspect the walkway connecting to Lift R1, the pathway in front of male and female restrooms in R1", "b6f1c810-aa59-47d3-b8b3-eede3007da15"},
            {"Inspect the pathways connecting to the escalator in the F&B Zone (Food Hall) and the surrounding area", "b6f1c810-aa59-47d3-b8b3-eede3007da16"},
            {"Inspect the corridor leading to Plant Room 5 and its surrounding area", "b6f1c810-aa59-47d3-b8b3-eede3007da17"},
            {"Inspect the pathway connecting to the loading area", "b6f1c810-aa59-47d3-b8b3-eede3007da18"},
        };
        var list_map_title = new Dictionary<string, List<string>>() 
        {
        {
            "Parking Lift R2 (No QR)",
            new List < string > () {
                "Inspect the escalator R2",
                "Inspect front of parking lift R2",
                "Inspect central corridor retail R2"
            }
        }, {
            "Fire Escape Staircase ST01",
            new List < string > () {
                "Inspect the fire escape staircase ST01, connecting path to Loading B1",
            }
        } , {
            "Hallway Retail R2-R1 (No QR)",
            new List < string > () {
                "Inspect the corridor between Retail R2 and Retail R1 (Rotunda)",
            }
        } , {
            "Escalator 3 R1 (No QR)",
            new List < string > () {
                "Inspect the walkway and surrounding retail stores connected to the MRT and fire escape staircase R2",
            }
        } , {
            "Fire Escape Staircase R2",
            new List < string > () {
                "Inspect the area around the fire escape staircase R2 and the walkway to the food section",
            }
        } , {
            "Escalator 1 R1 (No QR)",
            new List < string > () {
                "Inspect the escalator, the connection between MRT, and the surrounding area around the walkway",
            }
        } , {
            "Lift R1 (No QR)",
            new List < string > () {
                "Inspect the walkway connecting to Lift R1, the pathway in front of male and female restrooms in R1",
            }
        } , {
            "Escalator F&B Zone",
            new List < string > () {
                "Inspect the pathways connecting to the escalator in the F&B Zone (Food Hall) and the surrounding area",
            }
        } , {
            "Shore Pole Plant Room 5 R1",
            new List < string > () {
                "Inspect the corridor leading to Plant Room 5 and its surrounding area",
            }
        } , {
            "Fire Escape Pathway R2 (No QR)",
            new List < string > () {
                "Inspect the pathway connecting to the loading area",
            }
        }      
    };
        var code = "PARADE";
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
            activityProcedureParade.Add(new trActivityProcedure
            {
                Id = Guid.NewGuid(),
                Code = i < 10 ? $"{code}00{i}" : $"{code}0{i}",
                TaskName = $"Parade Guard Tour Route {i}",
                SubtaskActions = JsonSerializer.Serialize(subact, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    AllowTrailingCommas = true 
                }),
                LocationId = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3d"),
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now
            });
        }
        return activityProcedureParade;
    }
}
