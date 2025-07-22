using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class CompletedPPMCommand : NotificationSendModel, IRequest<CompletedPPMResult>
{
  public int WorkOrderId { get; set; }
  public string CompletionComment { get; set; }
  public string CompletionSignature { get; set; }
  public Guid CompletedBy { get; set; }
}
