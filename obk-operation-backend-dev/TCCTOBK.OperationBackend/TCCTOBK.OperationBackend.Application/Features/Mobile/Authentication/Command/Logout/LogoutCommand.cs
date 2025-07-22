using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.Logout;

public class LogoutCommand : ICommand<LogoutResult>
{
  public string AccessToken { get; set; } = default!;
  public LogoutCommand(string accessToken)
  {
		AccessToken = accessToken;
  }
}
