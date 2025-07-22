using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.SetApproveInviteResidenceVisitor;

public class SetApproveInviteResidenceVisitorCommand : ICommand<SetApproveInviteResidenceVisitorResult>
{
    public bool setApprove { get; set; }
    public Guid inviteID { get; set; }
}
