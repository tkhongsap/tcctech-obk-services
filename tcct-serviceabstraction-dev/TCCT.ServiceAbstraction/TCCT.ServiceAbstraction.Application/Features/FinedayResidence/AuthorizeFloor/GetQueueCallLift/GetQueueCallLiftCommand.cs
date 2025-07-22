using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.GetQueueCallLift;

public class GetQueueCallLiftCommand : ICommand<GetQueueCallLiftResult>
{
    public Guid personID { get; set; }
    public int locationID { get; set; }
}
