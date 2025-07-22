using System;
using System.Windows.Input;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

public class CheckPreRegisterIsPassCommand : ICommand<CheckPreRegisterIsPassResult>
{
    public Guid InviteID { get; set; }
}
