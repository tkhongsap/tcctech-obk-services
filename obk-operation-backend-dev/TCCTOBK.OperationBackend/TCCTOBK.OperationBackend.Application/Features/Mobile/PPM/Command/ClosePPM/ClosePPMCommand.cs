using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class ClosePPMCommand : NotificationSendModel, IRequest<ClosePPMResult>
{
  public int workOrderId { get; set; }
  public string closureComment { get; set; }
  public string completionVerifiedBy { get; set; }
  public string closureSignature { get; set; }
  public Guid closedBy { get; set; }
}
