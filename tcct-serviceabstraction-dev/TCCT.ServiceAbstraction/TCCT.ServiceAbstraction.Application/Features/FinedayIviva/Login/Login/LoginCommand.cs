using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;
public class LoginCommand : ICommand<LoginResult>
{
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;

	public LoginCommand(string username, string password)
	{
		Username = username;
		Password = password;
	}
}
