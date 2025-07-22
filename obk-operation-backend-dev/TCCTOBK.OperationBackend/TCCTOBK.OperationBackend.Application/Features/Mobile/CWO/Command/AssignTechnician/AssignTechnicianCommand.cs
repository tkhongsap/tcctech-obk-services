using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class AssignTechnicianCommand : NotificationSendModel, IRequest<AssignTechnicianResult>
{
  public int CWOId { get; set; }
  public string AssignedBy { get; set; }
  public string TechnicianId { get; set; }
  public string OperatorNote { get; set; }
  public int LocationId { get; set; }
  public string? Description { get; set; }
  public int RequesterId { get; set; }
  public int AssetId { get; set; }
}
