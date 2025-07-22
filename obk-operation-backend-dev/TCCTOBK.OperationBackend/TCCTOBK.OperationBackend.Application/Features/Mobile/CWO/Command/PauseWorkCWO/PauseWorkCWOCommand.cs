using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class PauseWorkCWOCommand : NotificationSendModel, IRequest<PauseWorkCWOResult>
{

  public int cwoId { get; set; }
  public string pausedBy { get; set; }
  public string reason { get; set; }
  public string? ImageBase64 { get; set; }
}
