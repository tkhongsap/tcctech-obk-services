using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.CheckQueueLift;

public class CheckQueueLiftCommand : ICommand<CheckQueueLiftResult>
{
    public Guid personID { get; set; }
    public int locationID { get; set; }
}
