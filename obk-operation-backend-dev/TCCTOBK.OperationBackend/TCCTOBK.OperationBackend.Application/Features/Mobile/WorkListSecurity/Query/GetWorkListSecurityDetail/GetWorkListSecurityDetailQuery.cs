using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetWorkListSecurityDetailQuery : IQuery<List<GetWorkListSecurityDetailResult>>
{
  public int WorkId { get; set; }
  public string WorkType { get; set; } = default!;
}
