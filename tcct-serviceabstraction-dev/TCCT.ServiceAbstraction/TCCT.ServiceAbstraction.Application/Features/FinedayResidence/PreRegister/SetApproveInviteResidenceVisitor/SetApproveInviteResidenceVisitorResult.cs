using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.SetApproveInviteResidenceVisitor;

public class SetApproveInviteResidenceVisitorResult
{
    public string message { get; set; } = null!;
    public int status { get; set; }
    public SetApproveInviteResidenceVisitorResultData? data { get; set; }
}

public class SetApproveInviteResidenceVisitorResultData
{
    public string inviteID { get; set; }
    public bool approveStatus { get; set; }
}
