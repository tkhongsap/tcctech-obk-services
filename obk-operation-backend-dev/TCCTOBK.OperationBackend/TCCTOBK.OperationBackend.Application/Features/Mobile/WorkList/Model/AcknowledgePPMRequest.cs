namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgePPMRequest
{
  public AcknowledgePPMRequest(int workOrderId, Guid ackedBy, string acknowledgementSignature)
  {
    this.WorkOrderId = workOrderId;
    this.AckedBy = ackedBy;
    this.AcknowledgementSignature = acknowledgementSignature;
  }

  public int WorkOrderId { get; set; }
  public Guid AckedBy { get; set; }
  public string AcknowledgementSignature { get; set; }
}
