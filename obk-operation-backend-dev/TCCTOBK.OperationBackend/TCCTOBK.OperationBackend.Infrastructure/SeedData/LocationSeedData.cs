using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure;

public static class LocationSeedData
{
    public static List<string> floormap = new List<string>{
        "B", "G", "1", "2", "3", "4", "5", "6", "7"
    };
    public static List<Location> location = new List<Location>();

    public static List<Location> GenerateLocation()
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
        foreach (var item in floormap)
        {
            location.Add(new Location
            {
                LID = new Guid(lid[item]),
                FloorName = item,
                SiteName = "OBK",
                ZoneName = "R1",
                BuildingName = "O2",
                BuildingZoneName = "O2T1",
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now,
                Type = "floor"
            });
        }
        location.Add(new Location
        {
            LID = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3b"),
            FloorName = null,
            SiteName = "OBK",
            ZoneName = "CUP",
            BuildingName = "CUP",
            BuildingZoneName = null,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            Type = "builiding"
        });
        return location;
    }

    public static List<Location> GenerateLocationTOT()
    {
        location.Add(new Location
        {
            LID = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3c"),
            FloorName = null,
            SiteName = "OBK",
            ZoneName = "TOT",
            BuildingName = "TOT",
            BuildingZoneName = null,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            Type = "builiding"
        });
        return location;
    }

    public static List<Location> GenerateLocationParade()
    {
        location.Add(new Location
        {
            LID = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3d"),
            FloorName = null,
            SiteName = "OBK",
            ZoneName = "Parade",
            BuildingName = "Parade",
            BuildingZoneName = null,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            Type = "builiding"
        });
        return location;
    }

    public static List<Location> GenerateLocationTower4()
    {
        location.Add(new Location
        {
            LID = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3e"),
            FloorName = null,
            SiteName = "OBK",
            ZoneName = "Tower4",
            BuildingName = "Tower4",
            BuildingZoneName = null,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            Type = "builiding"
        });
        return location;
    }

    public static List<Location> GenerateLocationEOT()
    {
        location.Add(new Location
        {
            LID = new Guid("f1b3b3b4-1b3b-4b3b-8b3b-1b3b3b3b3b3f"),
            FloorName = null,
            SiteName = "OBK",
            ZoneName = "EOT",
            BuildingName = "EOT",
            BuildingZoneName = null,
            CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            CreatedByName = "System",
            CreatedDate = DateTime.Now,
            UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
            UpdatedByName = "System",
            UpdatedDate = DateTime.Now,
            Type = "builiding"
        });
        return location;
    }
}