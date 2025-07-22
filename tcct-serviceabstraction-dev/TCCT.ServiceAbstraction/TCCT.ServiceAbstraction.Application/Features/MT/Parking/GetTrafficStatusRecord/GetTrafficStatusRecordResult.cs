using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetTrafficStatusRecord;

public class GetTrafficStatusRecordResult
{
    public string? code { get; set; } = null!;
    public string? msg { get; set; }
    public GetTrafficStatusRecordDataResult? data { get; set; }
}

public class GetTrafficStatusRecordDataResult
{
    public int? total { get; set; }
    public int? pageSize { get; set; }
    public int? pageNo { get; set; }
    public int? totalPage { get; set; }
    public List<MonitoringPoint>? list { get; set; }
}

public class MonitoringPoint
{
    public string? eventId { get; set; }
    public string? monitoringPointSyscode { get; set; }
    public string? monitoringPointName { get; set; }
    public int? downwardFlow { get; set; }
    public int? upwardFlow { get; set; }
    public int? jamFlow { get; set; }
    public int? jamLevel { get; set; }
    public int? laneNo { get; set; }
    public int? laneState { get; set; }
    public int? queueLen { get; set; }
    public string? time { get; set; }
    public int? vehicleSpeed { get; set; }
    public string? cameraName { get; set; }
}
