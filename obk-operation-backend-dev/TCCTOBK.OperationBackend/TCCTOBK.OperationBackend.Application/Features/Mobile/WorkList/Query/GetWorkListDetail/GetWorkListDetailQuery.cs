using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetWorkListDetailQuery : IQuery<GetWorkListDetailResult>
{
  public int WorkId { get; set; }
  public string WorkType { get; set; } = default!;
}
