using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO.AssignSupervisorModel;

public class AssignSupervisorRequest
{
  public int CwoId { get; set; }
  public Guid SupervisorId { get; set; }
  public Guid AssignedBy { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public int Asset { get; set; }
}
