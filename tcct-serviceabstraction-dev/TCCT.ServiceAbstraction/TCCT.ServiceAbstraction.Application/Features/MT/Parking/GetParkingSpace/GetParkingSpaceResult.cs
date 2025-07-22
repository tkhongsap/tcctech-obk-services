using System;
using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingSpace;

public class GetParkingSpaceResult
{
    public string? _id { get; set; }
    public string? spaceSyscode { get; set; }
    public int? __v { get; set; }
    public string[]? alarmPlateNos { get; set; }
    public string? aswSyscode { get; set; }
    public string? floorName { get; set; }
    public string? floorSyscode { get; set; }
    public long? getTime { get; set; }
		[JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]

		public long? ibeaconIpcMajor { get; set; }
		[JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]

		public long? ibeaconIpcMinor { get; set; }
    public string? ibeaconIpcUuid { get; set; }
    public string? latitude { get; set; }
    public string? longitude { get; set; }
    public string? parkName { get; set; }
    public string? parkSyscode { get; set; }
    public DateTime? parkingTime { get; set; }
    public long? parkingTimeUTC { get; set; }
    public string? plateNo { get; set; }
    public string? plateNoPicUri { get; set; }
    public string? plateNoPicUrl { get; set; }
    public string[]? plateNos { get; set; }
    public string? spaceNo { get; set; }
    public string? spacePicUri { get; set; }
    public string? spacePicUrl { get; set; }
    public string? spaceType { get; set; }
    public string? spaceTypeKey { get; set; }
    public int? state { get; set; }
    public string? zoneId { get; set; }
    public string? zoneName { get; set; }
    public CarblockerHces carblockerHces { get; set; } = new CarblockerHces();
    public CarblockerDevice carblockerDevice { get; set; } = new CarblockerDevice();
    public ParkingExtension parkingExtension { get; set; } = new ParkingExtension();
}

public class ParkingExtension
{
    public string? _id { get; set; }
    public string? spaceSyscode { get; set; }
    public string? spaceNo { get; set; }
    public string? poleId { get; set; }
    public string? poleName { get; set; }
    public string? poleRow { get; set; }
    public string? poleColumn { get; set; }
    public string? poleColorName { get; set; }
    public string? poleColorCode { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public int? v { get; set; }
}
public class CarblockerHces
{
    public string? _id { get; set; }
    public string? spaceSyscode { get; set; }
    public string? spaceNo { get; set; }
    public string? device_id { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
}

public class CarblockerDevice
{
    public string? _id { get; set; }
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]
    public int? device_id { get; set; }
    public int? status { get; set; }
    public int? rssi { get; set; }
    public string? time { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public int? v { get; set; }
}

