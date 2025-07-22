

using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application;

public class CreateSOCCommand : ICommand<CreateSOCResult>
{
  public int LocationId { get; set; }
  public int AssetId { get; set; }
  public int CWOTypeId { get; set; }
  public int ProblemTypeId { get; set; }
  public string Description { get; set; }
}
