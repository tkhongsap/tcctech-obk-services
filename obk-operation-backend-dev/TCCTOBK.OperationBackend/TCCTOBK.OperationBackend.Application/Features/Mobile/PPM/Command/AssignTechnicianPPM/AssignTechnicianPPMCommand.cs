using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class AssignTechnicianPPMCommand : NotificationSendModel, IRequest<AssignTechnicianPPMResult>
{
  public int workOrderId { get; set; }
  public string technicianIds { get; set; }
  public Guid assignedBy { get; set; }
}
