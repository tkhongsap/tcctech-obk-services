using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionAccess;

public class SessionAccessCommand : ICommand<SessionAccessResult>
{
	public required string code { get; set; }
	public string? token { get; set; }
}