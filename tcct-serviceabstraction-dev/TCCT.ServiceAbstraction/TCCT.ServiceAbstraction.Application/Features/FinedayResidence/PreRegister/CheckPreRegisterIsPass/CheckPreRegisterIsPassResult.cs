using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

public class CheckPreRegisterIsPassResult
{
    public string? inviteID { get; set; }
    public string? cardNumber { get; set; }
    public bool? isPass { get; set; }
}
