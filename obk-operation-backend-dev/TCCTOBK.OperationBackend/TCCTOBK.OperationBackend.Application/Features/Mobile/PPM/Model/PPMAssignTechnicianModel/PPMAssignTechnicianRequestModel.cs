namespace TCCTOBK.OperationBackend.Application;

public class PPMAssignTechnicianRequestModel
{
  public int workOrderId { get; set; }
  public string technicianIds { get; set; }
  public Guid assignedBy { get; set; }
}
