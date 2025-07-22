using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class ReworkPPMCommand : NotificationSendModel, IRequest<ReworkPPMResult>
{

  public int workOrderId { get; set; }
  public string reasonToRework { get; set; }
  public Guid reworkRequestedBy { get; set; }
}
