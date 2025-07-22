using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParkingStations;

public class GetValetParkingStationsResult
{
    public int id { get; set; }
    public string createdAt { get; set; }
    public string updatedAt { get; set; }
    public string? deletedAt { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string location { get; set; }
    public bool active { get; set; }
}
