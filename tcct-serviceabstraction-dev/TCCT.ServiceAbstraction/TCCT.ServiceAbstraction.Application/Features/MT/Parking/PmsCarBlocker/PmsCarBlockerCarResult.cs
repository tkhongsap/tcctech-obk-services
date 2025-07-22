using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlocker;

public class PmsCarBlockerResult
{
    public string? _id { get; set; }
    public int? device_id { get; set; }
    public int? status { get; set; }
    public int? rssi { get; set; }
    public string? time { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public int? __v { get; set; }
}
