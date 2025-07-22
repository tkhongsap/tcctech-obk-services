using System;
using System.Text.Encodings.Web;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActivityProcedureEOTSeedData
{
    public static List<trActivityProcedure> GenerateActivityProcedureEOT()
    {
        var activityProcedureEOT = new List<trActivityProcedure>();
        var subtask = new Dictionary<string, string>()
        {
            {"Take a Photo", "7e45467f-fa3e-4687-959f-fbe8291f03f8"},
        };
        var list_map_title = new Dictionary<string, List<string>>() 
        {
            {"Drop off (G Floor) 1", new List<string> { "Take a Photo" }},
            {"Drop off (G Floor) 2", new List<string> { "Take a Photo" }},
            {"McKinnon Road", new List<string> { "Take a Photo" }},
            {"Cross Road Civic Plaza", new List<string> { "Take a Photo" }},
            {"ONE BANGKOK PARK", new List<string> { "Take a Photo" }},
            {"LOBBY TOWER4", new List<string> { "Take a Photo" }},
            {"FHC B1M - Blvd Entry", new List<string> { "Take a Photo" }},
            {"B1M TO EXAT WAY", new List<string> { "Take a Photo" }},
            {"B1M to Drop-off G Fl", new List<string> { "Take a Photo" }},
            {"Motorcycle Parking FHC1", new List<string> { "Take a Photo" }},
            {"Motorcycle Parking FHC2", new List<string> { "Take a Photo" }},
            {"Customer Ramp - B1M to B3", new List<string> { "Take a Photo" }},
            {"Construction Ramp - B1 to B3", new List<string> { "Take a Photo" }},
            {"Joint way to Parking2 B3", new List<string> { "Take a Photo" }},
            {"Passenger Lift B3 - Tower 4", new List<string> { "Take a Photo" }},
            {"Exit to Entrance3", new List<string> { "Take a Photo" }},
            {"Entry to B2", new List<string> { "Take a Photo" }},
            {"Parking 1 B2", new List<string> { "Take a Photo" }},
            {"Garbage Room B1 - TOWER4", new List<string> { "Take a Photo" }},
            {"Delivery Parking @Loading TOWER4", new List<string> { "Take a Photo" }},
            {"Staff Parking B1 15 Slot", new List<string> { "Take a Photo" }},
            {"Staff Parking B1 - 24 Slot", new List<string> { "Take a Photo" }},
            {"End point @Service Route", new List<string> { "Take a Photo" }},
            {"to this stucture", new List<string> { "Take a Photo" }},
        };
        var code = "EOT";
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
            activityProcedureEOT.Add(new trActivityProcedure
            {
                Id = Guid.NewGuid(),
                Code = i < 10 ? $"{code}00{i}" : $"{code}0{i}",
                TaskName = $"EOT Guard Tour Route {i}",
                SubtaskActions = JsonSerializer.Serialize(subact, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    AllowTrailingCommas = true 
                }),
                LocationId = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3f"),
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now
            });
        }
        return activityProcedureEOT;
    }
}
