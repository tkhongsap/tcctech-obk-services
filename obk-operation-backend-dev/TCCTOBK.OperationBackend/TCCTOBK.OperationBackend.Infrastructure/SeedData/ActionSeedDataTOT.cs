using System;
using NPOI.SS.Formula.Functions;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActionSeedDataTOT
{
    public static List<trAction> GenerateActions()
    {
        var listActions = new List<trAction>();
        var actions = new Dictionary<string, string>
        {
            {"พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่", ""},
            {"พบรถยนต์จอดติดเครื่องยนต์หรือไม่", ""},
            {"ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่", ""},
            {"ภาพรวมเหตุการณ์ผิดปกติหรือไม่", "ภาพรวมเหตุการณ์โดยรอบพื้นที่ ณ ปัจจุบัน"},
            {"รายละเอียดเพิ่มเติม", ""}
        };
        var guid = new List<string>()
        {
            "b6f1c810-aa59-47d3-b8b3-eede3007da01",
            "b6f1c810-aa59-47d3-b8b3-eede3007da02",
            "b6f1c810-aa59-47d3-b8b3-eede3007da04",
            "b6f1c810-aa59-47d3-b8b3-eede3007da05",
            "b6f1c810-aa59-47d3-b8b3-eede3007da06",
        };
        for (int i = 0; i < guid.Count; i++)
        {
            listActions.Add(new trAction
            {
                Id = new Guid(guid[i]),
                Name = actions.Keys.ElementAt(i),
                Description = actions.Values.ElementAt(i),
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
        }
        return listActions;
    }
};