using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class ReworkCWOCommand : NotificationSendModel, IRequest<ReworkCWOResult>
{

  public int cwoId { get; set; }
  public string reasonToRework { get; set; }
  public string reworkRequestedBy { get; set; }
  public string? ImageBase64 { get; set; }
}
