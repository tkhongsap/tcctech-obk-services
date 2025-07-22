using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class CWODetailQuery : IQuery<CWODetailResult>
{
  public int Id { get; set; } = default!;
  public CWODetailQuery(int id)
  {
    Id = id;
  }
}
