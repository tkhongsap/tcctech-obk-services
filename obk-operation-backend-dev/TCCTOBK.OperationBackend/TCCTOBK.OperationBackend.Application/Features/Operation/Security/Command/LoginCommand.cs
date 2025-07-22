using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Security.Command;
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
