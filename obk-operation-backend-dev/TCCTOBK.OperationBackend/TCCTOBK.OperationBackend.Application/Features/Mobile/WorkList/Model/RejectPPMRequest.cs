namespace TCCTOBK.OperationBackend.Application;

public class RejectPPMRequest
{
  public RejectPPMRequest(int workOrderId, Guid rejectedBy, Guid technicianId)
  {
    WorkOrderId = workOrderId;
    RejectedBy = rejectedBy;
    TechnicianId = technicianId;
  }

  public int WorkOrderId { get; set; }
  public Guid RejectedBy { get; set; }
  public Guid TechnicianId { get; set; }
}
