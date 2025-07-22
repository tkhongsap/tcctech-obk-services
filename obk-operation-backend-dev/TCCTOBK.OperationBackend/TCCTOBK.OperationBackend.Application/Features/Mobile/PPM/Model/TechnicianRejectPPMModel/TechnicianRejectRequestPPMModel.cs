namespace TCCTOBK.OperationBackend.Application;

public class TechnicianRejectRequestPPMModel
{
  public int workOrderId { get; set; }
  public Guid rejectedBy { get; set; }
  public Guid technicianId { get; set; }
}
