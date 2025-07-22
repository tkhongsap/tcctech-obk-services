using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingQuery;

public class GetParkingQueryResult
{
    public string? code { get; set; } = null!;
    public string? msg { get; set; }
    public GetParkingQueryDataResult? data { get; set; }
}

public class GetParkingQueryDataResult
{
    public int? total { get; set; }
    public int? pageNo { get; set; }
    public int? pageSize { get; set; }
    public int? totalPage { get; set; }
    public List<ParkingInfo>? list { get; set; }
}

public class ParkingInfo
{
    public string? recordSyscode { get; set; }
    public string? spaceSyscode { get; set; }
    public string? spaceNo { get; set; }
    public string? spacePicUri { get; set; }
    public string? parkingTime { get; set; }
    public string? parkSyscode { get; set; }
    public string? parkName { get; set; }
    public string? floorSyscode { get; set; }
    public string? floorName { get; set; }
    public string? plateNoPicUri { get; set; }
    public string? aswSyscode { get; set; }
    public string? plateNo { get; set; }
    public string? spacePicUrl { get; set; }
    public string? plateNoPicUrl { get; set; }
    public string? spacePicBinary { get; set; }
    public string? ibeaconIpcUuid { get; set; }
    public string? ibeaconIpcMajor { get; set; }
    public string? ibeaconIpcMinor { get; set; }
}

