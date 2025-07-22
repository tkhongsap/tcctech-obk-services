using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentDetailQuery : IQuery<CaseIncidentDetailResult>
{
  public int Id { get; set; }
  public CaseIncidentDetailQuery(int id)
  {
    Id = id;
  }
}
