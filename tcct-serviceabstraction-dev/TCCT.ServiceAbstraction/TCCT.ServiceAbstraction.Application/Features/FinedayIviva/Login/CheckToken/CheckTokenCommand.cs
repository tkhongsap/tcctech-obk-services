using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.CheckToken;
public class CheckTokenCommand : ICommand<CheckTokenResult>
{
	public string Token { get; set; } = null!;

	public CheckTokenCommand(string token)
	{
		Token = token;
	}
}
