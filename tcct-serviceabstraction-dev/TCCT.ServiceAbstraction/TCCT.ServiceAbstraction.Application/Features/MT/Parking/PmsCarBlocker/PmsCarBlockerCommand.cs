using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlocker;

public class PmsCarBlockerCommand : ICommand<PmsCarBlockerResult>
{
    public required string DeviceId { get; set; }
}
