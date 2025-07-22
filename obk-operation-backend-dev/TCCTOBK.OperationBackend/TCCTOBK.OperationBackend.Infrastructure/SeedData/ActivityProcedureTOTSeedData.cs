using System;
using System.Text.Encodings.Web;
using System.Text.Json;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class ActivityProcedureTOTSeedData
{
    public static List<trActivityProcedure> GenerateActivityProcedureTOT()
    {
        var activityProcedureTOT = new List<trActivityProcedure>();
        var subtask = new Dictionary<string, string>()
        {
            {"พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่", "b6f1c810-aa59-47d3-b8b3-eede3007da01"},
            {"พบรถยนต์จอดติดเครื่องยนต์หรือไม่", "b6f1c810-aa59-47d3-b8b3-eede3007da02"},
            {"ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่", "b6f1c810-aa59-47d3-b8b3-eede3007da04"},
            {"ภาพรวมเหตุการณ์ผิดปกติหรือไม่", "b6f1c810-aa59-47d3-b8b3-eede3007da05"},
            {"รายละเอียดเพิ่มเติม", "b6f1c810-aa59-47d3-b8b3-eede3007da06"}
        };
        var list_map_title = new Dictionary<string, List<string>>() 
        {
        {
            "B3 Lift",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        }, {
            "B3 ST1",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        } , {
            "B3 ST2",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม"
            }
        } , {
            "B3 ST3",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        } , {
            "B3 FHC03",
            new List < string > () {
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        } , {
            "B3 ST4",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        } , {
            "B3 ST5",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        } , {
            "B3 ST6",
            new List < string > () {
                "พบเจอบุคคลมีพฤติกรรมน่าสงสัยหรือไม่",
                "พบรถยนต์จอดติดเครื่องยนต์หรือไม่",
                "ในบันใดหนีไฟมีบุคคลต้องสงสัยหรือไม่",
                "ภาพรวมเหตุการณ์ผิดปกติหรือไม่",
                "รายละเอียดเพิ่มเติม",
            }
        }   
    };
        var code = "TOT";
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
            activityProcedureTOT.Add(new trActivityProcedure
            {
                Id = Guid.NewGuid(),
                Code = i < 10 ? $"{code}00{i}" : $"{code}0{i}",
                TaskName = $"{code} Guard Tour Route {i}",
                SubtaskActions = JsonSerializer.Serialize(subact, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    AllowTrailingCommas = true 
                }),
                LocationId = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3c"),
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now
            });
        }
        return activityProcedureTOT;
    }
}
