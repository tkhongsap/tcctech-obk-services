using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionInit;

public class SessionInitCommand : ICommand<SessionInitResult>
{
	public required string uuid { get; set; }
	public string? token { get; set; }
	public string? option { get; set; }
	public string? duration { get; set; }
	public float? energy { get; set; }
}