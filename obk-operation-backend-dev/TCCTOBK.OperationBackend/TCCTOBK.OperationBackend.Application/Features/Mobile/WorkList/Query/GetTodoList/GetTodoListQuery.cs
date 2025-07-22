using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetTodoListQuery : IQuery<List<GetTodoListResult>>
{
  public string TechnicianId { get; set; } = default!;
  public int LocationId { get; set; }
}
