using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetTodoListSecurityQuery : IQuery<List<GetTodoListSecurityResult>>
{
  public string TechnicianId { get; set; } = default!;
  public int LocationId { get; set; }
}
