using System;
using NPOI.SS.Formula.Functions;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActionSeedDataEOT
{
    public static List<trAction> GenerateActions()
    {
        var listActions = new List<trAction>();
        listActions.Add(new trAction
        {
            Id = new Guid("7e45467f-fa3e-4687-959f-fbe8291f03f8"),
            Name = "Take a Photo",
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