using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

public class CancelInviteResidenceVisitorResult
{
    public string message { get; set; } = null!;
    public int status { get; set; }
    public string? data { get; set; }
}