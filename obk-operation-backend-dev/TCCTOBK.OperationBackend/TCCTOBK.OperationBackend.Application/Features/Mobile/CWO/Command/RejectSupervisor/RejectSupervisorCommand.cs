using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class RejectSupervisorCommand : IRequest<RejectSupervisorResult>
{
  public int cwoId { get; set; }
  public string rejectedBy { get; set; }
  public int locationId { get; set; }
  public string description { get; set; }
  public int requesterId { get; set; }
  public int assetId { get; set; }
  public string? ImageBase64 { get; set; }
  public string Comment { get; set; }
}
