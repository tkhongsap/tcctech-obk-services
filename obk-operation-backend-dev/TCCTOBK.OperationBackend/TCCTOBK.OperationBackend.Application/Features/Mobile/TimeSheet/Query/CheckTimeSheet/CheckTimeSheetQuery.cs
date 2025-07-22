using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class CheckTimeSheetQuery : IQuery<CheckTimeSheetResult>
{
  public string KCUsername { get; set; } = default!;
}
