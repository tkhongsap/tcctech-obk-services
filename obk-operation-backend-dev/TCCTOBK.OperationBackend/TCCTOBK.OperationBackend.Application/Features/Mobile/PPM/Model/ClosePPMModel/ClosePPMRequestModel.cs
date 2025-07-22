namespace TCCTOBK.OperationBackend.Application;

public class ClosePPMRequestModel
{
  public int workOrderId { get; set; }
  public string closureComment { get; set; }
  public string completionVerifiedBy { get; set; }
  public string closureSignature { get; set; }
  public Guid closedBy { get; set; }
}
