using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class AcknowlegePPMCommand : NotificationSendModel, IRequest<AcknowlegePPMResult>
{
  public int WorkOrderId { get; set; }
  public Guid AckedBy { get; set; }
  public string AcknowledgementSignature { get; set; }
}
