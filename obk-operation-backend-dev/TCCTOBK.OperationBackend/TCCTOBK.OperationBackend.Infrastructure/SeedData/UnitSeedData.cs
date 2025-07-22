using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure;

public static class UnitSeedData
{
    public static List<Unit> unit = new List<Unit>();

    public static List<Unit> GenerateUnit()
    {
        var lid = new Dictionary<string, string>()
        {
            {"B", "2c055101-2271-44e0-95fe-bcf2c59a459a"},
            {"G", "68b6dd1a-2154-4e99-ae33-cefe813a39be"},
            {"1", "be2d7f6f-b1b7-44b7-b6d2-e2293e08cf8d"},
            {"2", "1da79990-2879-44e8-9cfe-7daf52b6471d"},
            {"3", "60b2512b-1001-47a5-88b8-12a22a615e56"},
            {"4", "ff813ffb-0608-4014-91c9-1ac8fa6f5487"},
            {"5", "28b47a29-104a-40c6-b11b-36f61412c1e2"},
            {"6", "a0935ba2-0d0c-4348-9ab9-614c1bc01d34"},
            {"7", "9add2d8b-cc0e-4413-b40d-643833dc5c80"},
        };
        var u = new Dictionary<string, int>()
        {
            {"B", 53},
            {"G", 34},
            {"1", 29},
            {"2", 63},
            {"3", 39},
            {"4", 38},
            {"5", 52},
            {"6", 3},
            {"7", 1}
        };

        var alphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var special = new Dictionary<string, int>
        {
            {"1B102", 4},
            {"1B144", 2},
            {"1201", 16},
            {"1203", 2},
            {"1241", 5},
            {"1407", 2},
            {"1507", 2},
            {"OP1501", 1}
        };

        foreach (var item in u)
        {
            var length = item.Value;
            for (int i = 1; i <= length; i++)
            {
                var unitno = "";
                if (alphabet.Contains(item.Key))
                {
                    if (item.Key == "B")
                    {
                        unitno = $"1{item.Key}{100 + i}";
                    }
                    else
                    {
                        unitno = $"1{item.Key}{(i < 10 ? $"0{i}" : $"{i}")}";
                    }
                }
                else
                {
                    unitno = $"1{item.Key}{(i < 10 ? $"0{i}" : $"{i}")}";
                }
                if (special.ContainsKey(unitno))
                {
                    for (int j = 0; j < special[unitno]; j++)
                    {
                        unit.Add(new Unit
                        {
                            LID = new Guid(lid[item.Key]),
                            UID = Guid.NewGuid(),
                            UnitNo = $"{unitno}{alphabet[j]}",
                            Area = 100,
                            IndoorSpillOutSeating = 10,
                            InlineAreaIndoorZone = 20,
                            InlineAreaOutdoorZone = 30,
                            UnitType = 1,
                            Lat = 0,
                            Long = 0,
                            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                            CreatedByName = "System",
                            CreatedDate = DateTime.Now,
                            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                            UpdatedByName = "System",
                            UpdatedDate = DateTime.Now,
                            IsActive = true
                        });
                        length--;
                    }
                }
                else
                {
                    unit.Add(new Unit
                    {
                        LID = new Guid(lid[item.Key]),
                        UID = Guid.NewGuid(),
                        UnitNo = unitno,
                        Area = 100,
                        IndoorSpillOutSeating = 10,
                        InlineAreaIndoorZone = 20,
                        InlineAreaOutdoorZone = 30,
                        UnitType = 1,
                        Lat = 0,
                        Long = 0,
                        CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                        CreatedByName = "System",
                        CreatedDate = DateTime.Now,
                        UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                        UpdatedByName = "System",
                        UpdatedDate = DateTime.Now,
                        IsActive = true
                    });
                }
            }
        }
        // Remove unitno "1G16" and "1G17"
        unit.RemoveAll(u => u.UnitNo == "1G16" || u.UnitNo == "1G17" || u.UnitNo == "1603");
        unit.RemoveAll(u => u.UnitNo == "1204" || u.UnitNo == "1205" || u.UnitNo == "1206" || u.UnitNo == "1207");
        unit.RemoveAll(u => u.UnitNo == "1B117" || u.UnitNo == "1B118" || u.UnitNo == "1B126" || u.UnitNo == "1B127" || u.UnitNo == "1B128" || u.UnitNo == "1B129");
        unit.RemoveAll(u => u.UnitNo == "1335" || u.UnitNo == "1336" || u.UnitNo == "1337");
        unit.RemoveAll(u => u.UnitNo == "1504" || u.UnitNo == "1505");

        // Add unitno "1G16&1G17" with the same parameters as 1G16
        unit.Add(new Unit
        {
            LID = new Guid(lid["G"]),
            UID = Guid.NewGuid(),
            UnitNo = "1G16&1G17",
            Area = 100,
            IndoorSpillOutSeating = 10,
            InlineAreaIndoorZone = 20,
            InlineAreaOutdoorZone = 30,
            UnitType = 1,
            Lat = 0,
            Long = 0,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            IsActive = true
        });
        unit.Add(new Unit
        {
            LID = new Guid(lid["6"]),
            UID = Guid.NewGuid(),
            UnitNo = "1603+1604",
            Area = 100,
            IndoorSpillOutSeating = 10,
            InlineAreaIndoorZone = 20,
            InlineAreaOutdoorZone = 30,
            UnitType = 1,
            Lat = 0,
            Long = 0,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            IsActive = true
        });

        // Open unit : unit type = 2
        var open = new Dictionary<string, Dictionary<string, int>>()
        {
            {"OP", new Dictionary<string, int>(){
                {"B", 8},
                {"G", 8},
                {"1", 3},
                {"2", 1},
                {"3", 10},
                {"4", 1},
                {"5", 11}
            }},
            {"TH", new Dictionary<string, int>(){
                {"B", 4}
            }},
        };
        foreach (var op in open)
        {
            foreach (var item in op.Value)
            {
                var length = item.Value;
                for (int i = 1; i <= length; i++)
                {
                    var unitno = "";
                    if (alphabet.Contains(item.Key))
                    {
                        if (item.Key == "B")
                        {
                            unitno = $"{op.Key}1{item.Key}{100 + i}";
                        }
                        else
                        {
                            unitno = $"{op.Key}1{item.Key}{(i < 10 ? $"0{i}" : $"{i}")}";
                        }
                    }
                    else
                    {
                        unitno = $"{op.Key}1{item.Key}{(i < 10 ? $"0{i}" : $"{i}")}";
                    }
                    if (special.ContainsKey(unitno))
                    {
                        for (int j = 0; j <= special[unitno]; j++)
                        {
                            unit.Add(new Unit
                            {
                                LID = new Guid(lid[item.Key]),
                                UID = Guid.NewGuid(),
                                UnitNo = $"{unitno}{alphabet[j]}",
                                Area = 100,
                                IndoorSpillOutSeating = 10,
                                InlineAreaIndoorZone = 20,
                                InlineAreaOutdoorZone = 30,
                                UnitType = 2,
                                Lat = 0,
                                Long = 0,
                                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                                CreatedByName = "System",
                                CreatedDate = DateTime.Now,
                                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                                UpdatedByName = "System",
                                UpdatedDate = DateTime.Now,
                                IsActive = true
                            });
                            length--;
                        }
                    }
                    else
                    {
                        unit.Add(new Unit
                        {
                            LID = new Guid(lid[item.Key]),
                            UID = Guid.NewGuid(),
                            UnitNo = unitno,
                            Area = 100,
                            IndoorSpillOutSeating = 10,
                            InlineAreaIndoorZone = 20,
                            InlineAreaOutdoorZone = 30,
                            UnitType = 2,
                            Lat = 0,
                            Long = 0,
                            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                            CreatedByName = "System",
                            CreatedDate = DateTime.Now,
                            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                            UpdatedByName = "System",
                            UpdatedDate = DateTime.Now,
                            IsActive = true
                        });

                    }
                }
            }
        }
        unit.RemoveAll(u => u.UnitNo == "OP1G04" || u.UnitNo == "OP1G05");
        unit.RemoveAll(u => u.UnitNo == "OP1505");
        unit.First(u => u.UnitNo == "OP1401").UnitNo = "OP1402";

        // Event space : unit type = 3
        var e = new Dictionary<string, int>(){
            {"B", 4},
            {"G", 1},
            {"2", 1},
            {"4", 1},
        };
        foreach (var item in e)
        {
            var length = item.Value;
            for (int i = 1; i <= length; i++)
            {
                var unitno = "";
                if (alphabet.Contains(item.Key))
                {
                    if (item.Key == "B")
                    {
                        unitno = $"E1{item.Key}{100 + i}";
                    }
                    else
                    {
                        unitno = $"E1{item.Key}{(i < 10 ? $"0{i}" : $"{i}")}";
                    }
                }
                else
                {
                    unitno = $"E1{item.Key}{(i < 10 ? $"0{i}" : $"{i}")}";
                }
                unit.Add(new Unit
                {
                    LID = new Guid(lid[item.Key]),
                    UID = Guid.NewGuid(),
                    UnitNo = unitno,
                    Area = 100,
                    IndoorSpillOutSeating = 10,
                    InlineAreaIndoorZone = 20,
                    InlineAreaOutdoorZone = 30,
                    UnitType = 3,
                    Lat = 0,
                    Long = 0,
                    CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                    CreatedByName = "System",
                    CreatedDate = DateTime.Now,
                    UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                    UpdatedByName = "System",
                    UpdatedDate = DateTime.Now,
                    IsActive = true
                });
            }
        }
        return unit;
    }
}