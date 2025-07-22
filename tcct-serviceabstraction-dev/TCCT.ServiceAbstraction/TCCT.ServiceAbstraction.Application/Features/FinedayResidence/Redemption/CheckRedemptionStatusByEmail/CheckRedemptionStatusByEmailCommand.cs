using TCCT.ServiceAbstraction.Application.Configuration.Commands;
namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.CheckRedemptionStatusByEmail;

public class CheckRedemptionStatusByEmailCommand : ICommand<CheckRedemptionStatusByEmailResult>
{
    public string[] email { get; set; }
}
