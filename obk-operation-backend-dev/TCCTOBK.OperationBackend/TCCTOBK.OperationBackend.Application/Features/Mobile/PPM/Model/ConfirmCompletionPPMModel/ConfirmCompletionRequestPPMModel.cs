namespace TCCTOBK.OperationBackend.Application;

public class ConfirmCompletionRequestPPMModel
{
  public int servicingObjectId { get; set; }
  public Guid confirmedBy { get; set; }
}
