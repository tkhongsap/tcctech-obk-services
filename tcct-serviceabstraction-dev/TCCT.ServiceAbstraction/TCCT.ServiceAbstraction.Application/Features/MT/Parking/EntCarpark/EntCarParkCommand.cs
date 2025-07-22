using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.EntCarpark;

public class EntCarparkCommand : ICommand<EntCarparkResult>
{
    public string entDate { get; set; }
    public string plateNo { get; set; }
    public string thridPartyId { get; set; }
}
