using Amazon.Runtime.Internal;
using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class StampTimeSheetCommand : IRequest<StampTimeSheetResult>
{
  public string KCUsername { get; set; } = default!;
  public string CheckCode { get; set; } = default!;
}
