using System;
using NPOI.SS.Formula.Functions;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActionSeedDataParade
{
    public static List<trAction> GenerateActions()
    {
        var listActions = new List<trAction>();
        var actions = new Dictionary<string, string>
        {
            {"Inspect the escalator R2", ""},
            {"Inspect front of parking lift R2", ""},
            {"Inspect central corridor retail R2", ""},
            {"Inspect the fire escape staircase ST01, connecting path to Loading B1", ""},
            {"Inspect the corridor between Retail R2 and Retail R1 (Rotunda)", ""},
            {"Inspect the walkway and surrounding retail stores connected to the MRT and fire escape staircase R2", ""},
            {"Inspect the area around the fire escape staircase R2 and the walkway to the food section", ""},
            {"Inspect the escalator, the connection between MRT, and the surrounding area around the walkway", ""},
            {"Inspect the walkway connecting to Lift R1, the pathway in front of male and female restrooms in R1", ""},
            {"Inspect the pathways connecting to the escalator in the F&B Zone (Food Hall) and the surrounding area", ""},
            {"Inspect the corridor leading to Plant Room 5 and its surrounding area", ""},
            {"Inspect the pathway connecting to the loading area", ""},
        };
        var guid = new List<string>()
        {
            "b6f1c810-aa59-47d3-b8b3-eede3007da07",
            "b6f1c810-aa59-47d3-b8b3-eede3007da08",
            "b6f1c810-aa59-47d3-b8b3-eede3007da09",
            "b6f1c810-aa59-47d3-b8b3-eede3007da10",
            "b6f1c810-aa59-47d3-b8b3-eede3007da11",
            "b6f1c810-aa59-47d3-b8b3-eede3007da12",
            "b6f1c810-aa59-47d3-b8b3-eede3007da13",
            "b6f1c810-aa59-47d3-b8b3-eede3007da14",
            "b6f1c810-aa59-47d3-b8b3-eede3007da15",
            "b6f1c810-aa59-47d3-b8b3-eede3007da16",
            "b6f1c810-aa59-47d3-b8b3-eede3007da17",
            "b6f1c810-aa59-47d3-b8b3-eede3007da18",
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
        return listActions;
    }
};