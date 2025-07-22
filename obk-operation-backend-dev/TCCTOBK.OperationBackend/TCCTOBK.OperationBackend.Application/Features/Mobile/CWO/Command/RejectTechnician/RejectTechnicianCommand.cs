using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class RejectTechnicianCommand : NotificationSendModel, IRequest<RejectTechnicianResult>
{
  public int CWOId { get; set; }
  public string RejectedBy { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public int AssetId { get; set; }
  public string? ImageBase64 { get; set; }
  public string Comment { get; set; }
}
