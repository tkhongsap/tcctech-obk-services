using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStop;
public class SessionStopCommand : ICommand<SessionStopResult>
{
	public required string uuid { get; set; }
	public string? token { get; set; }
}