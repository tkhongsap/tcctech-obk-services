using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.GetDataInviteVisitorTransaction;

public class GetDataInviteVisitorTransactionQuery : ICommand<GetDataInviteVisitorTransactionResult>
{
    public Guid personID { get; set; }
}
