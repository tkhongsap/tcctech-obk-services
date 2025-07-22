using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class TechnicainAcknowledgeCommand : NotificationSendModel, IRequest<TechnicainAcknowledgeResult>
{
  public int CwoId { get; set; }
  public Guid AckedBy { get; set; }
  public string AckVerifiedBy { get; set; }
  public string AcknowledgementSignature { get; set; }
  public string SupportiveTechnicianIds { get; set; }
  public bool IsWorkingOffline { get; set; }
  public string WorkOfflineReason { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public int AssetId { get; set; }
  public string? ImageBase64 { get; set; }
}
