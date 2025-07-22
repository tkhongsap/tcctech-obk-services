using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgeWorkSecurityCommand : IRequest<AcknowledgeWorkSecurityResult>
{
  public int WorkId { get; set; } = default!;
  public string TechniciansId { get; set; } = default!;
  public string WorkType { get; set; } = default!;
  public int LocationId { get; set; }
  public int assetId { get; set; }
  public AcknowledgeWorkSecurityCommand(int workid, string techniciansid, string worktype)
  {
    WorkId = workid;
    TechniciansId = techniciansid;
    WorkType = worktype;
  }
}
