using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class RejectWorkSecurityCommand : IRequest<RejectWorkSecurityResult>
{
  public int WorkId { get; set; }
  public string WorkType { get; set; } = default!;
  public string TechniciansId { get; set; } = default!;
  public string RejectReason { get; set; } = default!;
  public int Location { get; set; }
  public RejectWorkSecurityCommand(int workid, string techniciansid, string rejectreason, int location)
  {
    WorkId = workid;
    TechniciansId = techniciansid;
    RejectReason = rejectreason;
    Location = location;
  }
}