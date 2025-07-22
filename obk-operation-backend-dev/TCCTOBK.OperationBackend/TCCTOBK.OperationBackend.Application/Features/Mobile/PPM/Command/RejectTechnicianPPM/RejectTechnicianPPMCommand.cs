using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class RejectTechnicianPPMCommand : NotificationSendModel, IRequest<RejectTechnicianPPMResult>
{
  public int workOrderId { get; set; }
  public Guid rejectedBy { get; set; }
  public Guid technicianId { get; set; }
}
