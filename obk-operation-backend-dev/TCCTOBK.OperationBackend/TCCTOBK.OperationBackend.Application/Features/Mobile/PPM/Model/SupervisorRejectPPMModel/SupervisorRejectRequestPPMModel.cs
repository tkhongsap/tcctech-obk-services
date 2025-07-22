namespace TCCTOBK.OperationBackend.Application;

public class SupervisorRejectRequestPPMModel
{
  public int workOrderId { get; set; }
  public Guid rejectedBy { get; set; }
}
