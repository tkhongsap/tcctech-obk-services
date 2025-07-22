using System;
using System.Text.Encodings.Web;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActivityProcedureSeedData
{
    public static List<trActivityProcedure> GenerateActivityProcedure()
    {
        var activityProcedure = new List<trActivityProcedure>();
        var subtask = new Dictionary<string, string>()
        {
            {"Inspect the fire extinguishing equipment", "b6f1c810-aa59-47d3-b8b3-eede3007da03"},
            {"Inspect fire exit doors", "d7995a45-b4b9-4e18-9563-6d26905df239"},
            {"Inspect lighting in the area", "c8fee073-3a96-4257-bb88-5ccb7e90edfe"},
            {"Inspect facial recognition scanning system", "b916c27a-187c-47e3-8f2a-f44c79f14cf5"},
            {"Inspect door lock", "4a97d233-3e1d-4c97-9f84-1668947d8df4"},
            {"Inspect notification systems for signals", "be390a9b-21b2-4afc-a5f8-2daa0681ca48"},
            {"Inspect surrounding area", "72ead26c-ab0d-42a7-8a46-eb99f0287979"},
            {"Inspect the service elevator and the surroundings", "209533fd-11d2-461f-9458-06a79306c578"},
            {"Inspect all doors along the corridor", "53444db8-0878-4b39-ad78-d76393209694"},
            {"Check the physical CCTV Camera", "94ea2138-8e3a-456f-9bb0-bd02a2fffae6"},
            {"Inspect door left open", "8de8812d-1e37-44e0-b91e-91d45fd4d20c"},
            {"Inspect roller shutter", "836942e5-adc9-4be4-a73b-49fb588ec74d"},
            {"Inspect fire hose cabinet (FHC)", "9df655b5-6504-4a5a-b851-b3352fbb9f9e"},
            {"Inspect entry-exit doors of the office", "34cdcc75-de36-4914-aaa1-c1cfd6b7e2de"},
            {"Inspect cleanliness, tidiness and orderliness", "5465527a-3923-424f-960d-7032444e3042"},
            {"Inspect exterior of washroom surroundings", "957cb673-fde2-4217-a18f-10433b99e17b"},
            {"Inspect walk-through equipment and access control devices", "a2287602-0e1e-4158-9c91-524445378f89"},
            {"Inspect roller shutter and controller", "f68560c2-d6f5-4a88-b51c-d199c7c8f93f"},
            {"Inspect roller shutter (night)", "fbdad903-f7e3-4e06-9458-d8b55a5a752f"},
            {"Inspect for obstacles", "e7a949bc-2936-49ab-89c3-f27e9259abfd"},
            {"Fire hazard risks", "9a5f64cd-41d8-4de1-a01c-51a6c70a5dff"},
            {"Inspect driveway", "2b02e9f7-4673-44c8-95ed-ed9354101acf"}
        };
        var list_map_title = new Dictionary<string, List<string>>() 
        {
            {"L-10, Fire Exit Door 1 (Passenger Elevator)", new List<string>(){ "Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-10, Fire Exit Door 2", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-10, Front of Service Elevator", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment", "Inspect the service elevator and the surroundings" }},
            {"L-9, Fire Exit Door 1 (Passenger Elevator)", new List<string>(){ "Inspect all doors along the corridor", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-9, Fire Exit Door 2", new List<string>(){ "Check the physical CCTV Camera", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-9, Front of Service Elevator", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment", "Inspect the service elevator and the surroundings" }},
            {"L-8, Fire Exit Door 1 (Passenger Elevator)", new List<string>(){ "Inspect door left open", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-8, Fire Exit Door 2", new List<string>(){ "Check the physical CCTV Camera", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-8, Front of Service Elevator", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment" }},
            {"L-7, Fire Exit Door 1 (Passenger Elevator)", new List<string>(){ "Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-7, Fire Exit Door 2", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-7, Front of Service Elevator", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment" }},
            {"L-6, Fire Exit Door 1 (Passenger Elevator)", new List<string>(){ "Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-6, Fire Exit Door 2", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-6, Front of Service Elevator", new List<string>(){ "Inspect roller shutter", "Inspect surrounding area", "Inspect the fire extinguishing equipment" }},
            {"L-5, Fire Exit Door 1 (Passenger Elevator)", new List<string>(){ "Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-5, Fire Exit Door 2", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect roller shutter", "Inspect the fire extinguishing equipment" }},
            {"L-5, Machine Room Door 1", new List<string>(){ "Inspect fire hose cabinet (FHC)", "Inspect lighting in the area", "Inspect notification systems for signals" }},
            {"L-5, Machine Room Door 2", new List<string>(){ "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-5, Front of Service Elevator", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment" }},
            {"L-4, Front Door of Passenger Elevator (STT area)", new List<string>(){ "Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-3, Front Door of Passenger Elevator (STT area)", new List<string>(){ "Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment" }},
            {"L-2, Office Entrance", new List<string>(){ "Inspect door lock", "Inspect entry-exit doors of the office", "Inspect facial recognition scanning system" }},
            {"L-2, Laundry Room", new List<string>(){ "Inspect cleanliness, tidiness and orderliness", "Inspect exterior of washroom surroundings" }},
            {"L-2, Behind the Stock Door", new List<string>(){ "Inspect cleanliness, tidiness and orderliness" }},
            {"L-2, Fire Exit Door", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-1, Laundry Room", new List<string>(){ "Inspect cleanliness, tidiness and orderliness" }},
            {"L-1 Fire Exit Door 2 / Hoist Door", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-1 in Front of Service Elevator", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment" }},
            {"L-M Air duct (Blind Corner)", new List<string>(){ "Inspect surrounding area", "Inspect the fire extinguishing equipment" }},
            {"L-M Fire Exit Door 2", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-G, Unloading Door / Access Door", new List<string>(){ "Inspect entry-exit doors of the office", "Inspect roller shutter and controller", "Inspect walk-through equipment and access control devices" }},
            {"L-B1, Fire Hose Next to the Machine Room Door", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-B1, Fire Exit Door 2 (RMU Room)", new List<string>(){ "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment" }},
            {"L-B1, Unloading Door (Machine Room)", new List<string>(){ "Inspect cleanliness, tidiness and orderliness", "Inspect entry-exit doors of the office", "Inspect roller shutter (night)" }},
            {"B3 Floor, Fire Exit Door 1 (Passenger Elevator) Septic tank", new List < string > () {"Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect the fire extinguishing equipment"}}, 
            {"L-B3, Septic tank", new List < string > () { "Inspect cleanliness, tidiness and orderliness" }},
            {"L-B3, Fire Exit Door 2 (Septic tank)", new List < string > () {"Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment"}}, 
            {"L-B4, Fire Exit Door 1 (Passenger Elevator) Machine Room", new List<string>() {"Inspect door lock", "Inspect facial recognition scanning system", "Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment"}}, 
            {"L-B4, Fire Exit Door 2 (Machine Room)", new List<string>() {"Inspect fire exit doors", "Inspect lighting in the area", "Inspect notification systems for signals", "Inspect the fire extinguishing equipment"}}, 
            {"Outdoor, Entry/Exit Side - Fire Escape Door",new List<string>() {"Inspect cleanliness, tidiness and orderliness", "Inspect door left open", "Inspect for obstacles", "Inspect roller shutter (night)"}},
            {"Outdoor, Assembly Point / Smoking Are", new List<string>() {"Fire hazard risks", "Inspect driveway"}}, 
            {"Outdoor, Temporary Carpark", new List<string>() {"Inspect cleanliness, tidiness and orderliness"}}, 
            {"Outdoor, The pathway Between the CUP and the Forum", new List<string>() {"Inspect cleanliness, tidiness and orderliness", "Inspect for obstacles", "Inspect lighting in the area"}},
            {"L-B1 Pathway to Veolia Room", new List<string>() {"Inspect surrounding area", "Inspect the fire extinguishing equipment"}}
        };

        var lid = new Dictionary<string, string>() {
            {"L-10, Fire Exit Door 1 (Passenger Elevator)" , "e8eb7171-de01-4a85-a955-711b210eecc0"},
            {"L-10, Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b210eecc1"},
            {"L-10, Front of Service Elevator2" , "e8eb7171-de01-4a85-a955-711b211eecc0"},
            {"L-9, Fire Exit Door 1 (Passenger Elevator)" , "e8eb7171-de01-4a85-a955-711b211eecc2"},
            {"L-9, Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b211eecc3"},
            {"L-9, Front of Service Elevator" , "e8eb7171-de01-4a85-a955-711b211eecc4"},
            {"L-8, Fire Exit Door 1 (Passenger Elevator)" , "e8eb7171-de01-4a85-a955-711b211eecc5"},
            {"L-8, Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b211eecc6"},
            {"L-8, Front of Service Elevator" , "e8eb7171-de01-4a85-a955-711b211eecc7"},
            {"L-7, Fire Exit Door 1 (Passenger Elevator)" , "e8eb7171-de01-4a85-a955-711b211eecc8"},
            {"L-7, Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b211eecc9"},
            {"L-7, Front of Service Elevator" , "e8eb7171-de01-4a85-a955-711b212eecc1"},
            {"L-6, Fire Exit Door 1 (Passenger Elevator)" , "e8eb7171-de01-4a85-a955-711b212eecc2"},
            {"L-6, Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b212eecc3"},
            {"L-6, Front of Service Elevator" , "e8eb7171-de01-4a85-a955-711b212eecc4"},
            {"L-5, Fire Exit Door 1 (Passenger Elevator)" , "e8eb7171-de01-4a85-a955-711b212eecc5"},
            {"L-5, Machine Room Door 1" , "e8eb7171-de01-4a85-a955-711b212eecc6"},
            {"L-5, Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b212eecc7"},
            {"L-5, Machine Room Door 2" , "e8eb7171-de01-4a85-a955-711b212eecc8"},
            {"L-5, Front of Service Elevator" , "e8eb7171-de01-4a85-a955-711b212eecc9"},
            {"L-4, Front Door of Passenger Elevator (STT area)" , "e8eb7171-de01-4a85-a955-711b213eecc1"},
            {"L-3, Front Door of Passenger Elevator (STT area)" , "e8eb7171-de01-4a85-a955-711b213eecc2"},
            {"L-2, Office Entrance" , "e8eb7171-de01-4a85-a955-711b213eecc3"},
            {"L-2, Laundry Room" , "e8eb7171-de01-4a85-a955-711b213eecc4"},
            {"L-2, Behind the Stock Door" , "e8eb7171-de01-4a85-a955-711b213eecc5"},
            {"L-2, Fire Exit Door" , "e8eb7171-de01-4a85-a955-711b213eecc6"},
            {"L-1, Laundry Room" , "e8eb7171-de01-4a85-a955-711b213eecc7"},
            {"L-1 Fire Exit Door 2 / Hoist Door" , "e8eb7171-de01-4a85-a955-711b213eecc8"},
            {"L-1 in Front of Service Elevator" , "e8eb7171-de01-4a85-a955-711b213eecc9"},
            {"L-M Air duct (Blind Corner)" , "e8eb7171-de01-4a85-a955-711b214eecc1"},
            {"L-M Fire Exit Door 2" , "e8eb7171-de01-4a85-a955-711b214eecc2"},
            {"L-G, Unloading Door / Access Door" , "e8eb7171-de01-4a85-a955-711b214eecc3"},
            {"L-B1, Fire Hose Next to the Machine Room Door" , "e8eb7171-de01-4a85-a955-711b214eecc4"},
            {"L-B1, Fire Exit Door 2 (RMU Room)" , "e8eb7171-de01-4a85-a955-711b214eecc5"},
            {"L-B1, Unloading Door (Machine Room)" , "e8eb7171-de01-4a85-a955-711b214eecc6"},
            {"B3 Floor, Fire Exit Door 1 (Passenger Elevator) Septic tank" , "e8eb7171-de01-4a85-a955-711b214eecc7"},
            {"L-B3, Septic tank" , "e8eb7171-de01-4a85-a955-711b214eecc8"},
            {"L-B3, Fire Exit Door 2 (Septic tank)" , "e8eb7171-de01-4a85-a955-711b214eecc9"},
            {"L-B4, Fire Exit Door 1 (Passenger Elevator) Machine Room" , "e8eb7171-de01-4a85-a955-711b215eecc1"},
            {"L-B4, Fire Exit Door 2 (Machine Room)" , "e8eb7171-de01-4a85-a955-711b215eecc2"},
            {"Outdoor, Entry/Exit Side - Fire Escape Door" , "e8eb7171-de01-4a85-a955-711b215eecc3"},
            {"Outdoor, Assembly Point / Smoking Are" , "e8eb7171-de01-4a85-a955-711b215eecc4"},
            {"Outdoor, Temporary Carpark" , "e8eb7171-de01-4a85-a955-711b215eecc5"},
            {"Outdoor, The pathway Between the CUP and the Forum" , "e8eb7171-de01-4a85-a955-711b215eecc6"},
            {"L-B1 Pathway to Veolia Room" , "e8eb7171-de01-4a85-a955-711b215eecc8"},
            {"Fire Escape Staircase ST01" , "e8eb7171-de01-4a85-a955-711b215eecc9"},
            {"Fire Escape Staircase R2" , "e8eb7171-de01-4a85-a955-711b216eecc1"},
            {"Escalator F&B Zone" , "e8eb7171-de01-4a85-a955-711b216eecc2"},
            {"Shore Pole Plant Room 5 R1" , "e8eb7171-de01-4a85-a955-711b216eecc3"},
            {"EXAT WAY" , "e8eb7171-de01-4a85-a955-711b216eecc4"},
            {"Drop off (G Floor) 1" , "e8eb7171-de01-4a85-a955-711b216eecc5"},
            {"Drop off (G Floor) 2" , "e8eb7171-de01-4a85-a955-711b216eecc6"},
            {"Cross Road Civic Plaza" , "e8eb7171-de01-4a85-a955-711b216eecc7"},
            {"ONE BANGKOK PARK" , "e8eb7171-de01-4a85-a955-711b216eecc8"}
        };
        var code = "CUP";
        for (int i = 1; i <= 1; i++)
        {
            var subact = new List<object>();
            foreach(var item in list_map_title)
            {
                var actionsId = new List<Guid>();
                if (lid.ContainsKey(item.Key))
                {
                    actionsId.Add(new Guid(lid[item.Key]));
                }
                foreach(var sub in item.Value)
                {
                    actionsId.Add(new Guid(subtask[sub]));
                }
                actionsId.Add(new Guid("7e45467f-fa3e-4687-959f-fbe8291f03f7"));
                var obj = new
                {
                    name = item.Key,
                    actions = actionsId
                };
                subact.Add(obj);
            }
            activityProcedure.Add(new trActivityProcedure
            {
                Id = Guid.NewGuid(),
                Code = i < 10 ? $"{code}00{i}" : $"{code}0{i}",
                TaskName = $"CUP Guard Tour Route {i}",
                SubtaskActions = JsonSerializer.Serialize(subact, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    AllowTrailingCommas = true 
                }),
                LocationId = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3b"),
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now
            });
        }
        return activityProcedure;
    }
}
