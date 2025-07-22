using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.Invite;

public class InviteResidenceVisitorResult
{
    public string message { get; set; } = null!;
    public int status { get; set; }
    public InviteResidenceVisitorResultData? data { get; set; }
}

public class InviteResidenceVisitorResultData
{
    public string inviteID { get; set; }
}