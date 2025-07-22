namespace TCCTOBK.OperationBackend.Application;

public class ReworkPPMRequestModel
{
  public int workOrderId { get; set; }
  public string reasonToRework { get; set; }
  public Guid reworkRequestedBy { get; set; }
}
