using System;
using NPOI.SS.Formula.Functions;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActionSeedData
{
    public static List<trAction> GenerateActions()
    {
        var listActions = new List<trAction>();
        var actions = new Dictionary<string, string>
        {
            {"Inspect the fire extinguishing equipment", "To check the fire extinguishing equipment expiry date"},
            {"Inspect fire exit doors", "Inspect fire exit doors and make sure they are closed"},
            {"Inspect lighting in the area", "Inspect lighting in the area and make sure lights they are working"},
            {"Inspect facial recognition scanning system", "Inspect facial recognition scanning system and make sure it is working"},
            {"Inspect door lock", "Ensure door locking mechanism working"},
            {"Inspect notification systems for signals", "Inspect notification systems for various signals in the area. Ensure casings are not tampered"},
            {"Inspect surrounding area", "Inspect the surrounding area"},
            {"Inspect the service elevator and the surroundings", "Ensure service elevator is working and look out for anything that might be a potential security threat"},
            {"Inspect all doors along the corridor", "Ensure the doors are closed and locked"},
            {"Check the physical CCTV Camera", "Ensure camera has not been tampered"},
            {"Inspect door left open", "Ensure doors are closed"},
            {"Inspect roller shutter", "Ensure roller shutter fully closed,and not tampered"},
            {"Inspect fire hose cabinet (FHC)", "Ensure that the fire hose cabinet is easily accessible and not blocked by any obstructions"},
            {"Inspect entry-exit doors of the office", "Ensure entry-exit doors of office are secure"},
            {"Inspect cleanliness, tidiness and orderliness", "Ensure cleanliness, tidiness and orderliness around the area"},
            {"Inspect exterior of washroom surroundings", "Look out for anything that might be a potential security threat"},
            {"Inspect walk-through equipment and access control devices", "Ensure walk-through equipment and access control devices are working"},
            {"Inspect roller shutter and controller", "Ensure roller shutter is closed at all times unless loading/unloading, and ensure the controller is covered"},
            {"Inspect roller shutter (night)", "Ensure roller shutter is closed at all times unless loading/unloading and to be fully closed at all times at night"},
            {"Inspect for obstacles", "Ensure no obstacles around the vicinity "},
            {"Fire hazard risks", "Ensure no fire hazard risks"},
            {"Inspect driveway", "Ensure no vehicles parking along the driveway causing any obstructions"}
        };
        var guid = new List<string>()
        {
            "b6f1c810-aa59-47d3-b8b3-eede3007da03",
            "d7995a45-b4b9-4e18-9563-6d26905df239",
            "c8fee073-3a96-4257-bb88-5ccb7e90edfe",
            "b916c27a-187c-47e3-8f2a-f44c79f14cf5",
            "4a97d233-3e1d-4c97-9f84-1668947d8df4",
            "be390a9b-21b2-4afc-a5f8-2daa0681ca48",
            "72ead26c-ab0d-42a7-8a46-eb99f0287979",
            "209533fd-11d2-461f-9458-06a79306c578",
            "53444db8-0878-4b39-ad78-d76393209694",
            "94ea2138-8e3a-456f-9bb0-bd02a2fffae6",
            "8de8812d-1e37-44e0-b91e-91d45fd4d20c",
            "836942e5-adc9-4be4-a73b-49fb588ec74d",
            "9df655b5-6504-4a5a-b851-b3352fbb9f9e",
            "34cdcc75-de36-4914-aaa1-c1cfd6b7e2de",
            "5465527a-3923-424f-960d-7032444e3042",
            "957cb673-fde2-4217-a18f-10433b99e17b",
            "a2287602-0e1e-4158-9c91-524445378f89",
            "f68560c2-d6f5-4a88-b51c-d199c7c8f93f",
            "fbdad903-f7e3-4e06-9458-d8b55a5a752f",
            "e7a949bc-2936-49ab-89c3-f27e9259abfd",
            "9a5f64cd-41d8-4de1-a01c-51a6c70a5dff",
            "2b02e9f7-4673-44c8-95ed-ed9354101acf"
        };
        for (int i = 0; i < guid.Count; i++)
        {
            listActions.Add(new trAction
            {
                Id = new Guid(guid[i]),
                Name = actions.Keys.ElementAt(i),
                Description = actions.Values.ElementAt(i),
                ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                MetaData = null,
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now,
                IsRequired = 1,
            });
        }
        listActions.Add(new trAction
        {
            Id = new Guid("7e45467f-fa3e-4687-959f-fbe8291f03f7"),
            Name = "Summary",
            Description = "",
            ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
            MetaData = null,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            IsRequired = 1,
        });
        return listActions;
    }
};