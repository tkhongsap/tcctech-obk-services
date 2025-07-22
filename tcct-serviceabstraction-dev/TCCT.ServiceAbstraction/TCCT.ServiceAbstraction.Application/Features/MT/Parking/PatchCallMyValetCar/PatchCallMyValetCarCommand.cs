using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PatchCallMyValetCar;

public class PatchCallMyValetCarCommand : ICommand<PatchCallMyValetCarResult>
{
    public int ValetCarId { get; set; }
    public string Status { get; set; }
    public int DropOffStationId { get; set; }
}

public class PatchCallMyValetCarReq
{
    public string Status { get; set; }
    public int DropOffStationId { get; set; }
}