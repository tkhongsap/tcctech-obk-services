using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Logout;
public class LogoutCommand : ICommand<LogoutResult>
{
	public string Token { get; set; } = null!;

	public LogoutCommand(string token)
	{
		Token = token;
	}
}
