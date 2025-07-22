using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class CloseCWOCommand : NotificationSendModel, IRequest<CloseCWOResult>
{
  public int cwoId { get; set; }
  public string closureComment { get; set; }
  public string completionVerifiedBy { get; set; }
  public string closureSignature { get; set; }
  public string closedBy { get; set; }
}
