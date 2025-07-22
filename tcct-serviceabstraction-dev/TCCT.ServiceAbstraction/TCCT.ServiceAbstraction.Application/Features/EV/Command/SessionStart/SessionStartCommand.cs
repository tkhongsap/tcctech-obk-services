using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStart;
public class SessionStartCommand : ICommand<SessionStartResult>
{
	public required string uuid { get; set; }
	public string? token { get; set; }
}