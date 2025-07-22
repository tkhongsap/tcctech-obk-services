using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class UATLoginCommand : IRequest<UATLoginResult>
{
  public string Username { get; set; } = default!;
  public string Password { get; set; } = default!;
}
