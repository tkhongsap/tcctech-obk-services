using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCheck;

public class ReserveCheckCommand : ICommand<ReserveCheckResult>
{
	public string? uuid { get; set; }
	public string? token { get; set; }
}