using MediatR;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class LoginCommand : IRequest<LoginResult>
{
  public string Username { get; set; } = default!;
  public string Password { get; set; } = default!;
  public LoginCommand(string username, string password)
  {
    Username = username;
    Password = password;
  }
}
