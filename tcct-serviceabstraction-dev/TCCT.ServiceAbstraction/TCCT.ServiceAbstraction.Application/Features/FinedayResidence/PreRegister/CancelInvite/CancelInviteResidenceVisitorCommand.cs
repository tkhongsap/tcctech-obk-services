using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

public class CancelInviteResidenceVisitorCommand : ICommand<CancelInviteResidenceVisitorResult>
{
    public Guid inviteID { get; set; }
    public Guid personID { get; set; }
}
