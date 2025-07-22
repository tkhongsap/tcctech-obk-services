using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlockerList;

public class PmsCarBlockerListCommand : ICommand<List<PmsCarBlockerListResult>>
{
    public PmsCarBlockerListCommand() {
        
    }
}
