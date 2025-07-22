using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class SOCDetailQuery : IQuery<SOCDetailResult>
{
  public int Id { get; set; }
  public SOCDetailQuery(int id)
  {
    Id = id;
  }
}
