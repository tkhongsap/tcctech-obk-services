using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class RejectWorkCommand : IRequest<RejectWorkResult>
{
  public int WorkId { get; set; }
  public string WorkType { get; set; } = default!;
  public string TechniciansId { get; set; } = default!;
  public string RejectReason { get; set; } = default!;
  public int Location { get; set; }
  public RejectWorkCommand(int workid, string techniciansid, string rejectreason, int location)
  {
    WorkId = workid;
    TechniciansId = techniciansid;
    RejectReason = rejectreason;
    Location = location;
  }
}