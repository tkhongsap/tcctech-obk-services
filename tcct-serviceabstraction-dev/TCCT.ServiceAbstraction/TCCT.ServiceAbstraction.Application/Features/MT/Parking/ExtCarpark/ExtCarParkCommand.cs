using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.ExtCarpark;

public class ExtCarparkCommand : ICommand<ExtCarparkResult>
{
    public string logId { get; set; }
}
