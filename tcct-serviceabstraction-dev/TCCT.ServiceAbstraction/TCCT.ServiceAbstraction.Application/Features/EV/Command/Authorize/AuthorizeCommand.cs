using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Authorize;
public class AuthorizeCommand : ICommand<AuthorizeResult>
{
	public string Accid { get; set; }
	public string AuthPassword { get; set; }
	public string AuthToken { get; set; }
}