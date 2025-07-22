using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class CheckTimeCommand : IRequest<CheckTimeResult>
{
  public string KCUsername { get; set; } = default!;
  public string CheckCode { get; set; } = default!;
  public CheckTimeCommand(string kcusername, string checkcode)
  {
    KCUsername = kcusername;
    CheckCode = checkcode;
  }
}
