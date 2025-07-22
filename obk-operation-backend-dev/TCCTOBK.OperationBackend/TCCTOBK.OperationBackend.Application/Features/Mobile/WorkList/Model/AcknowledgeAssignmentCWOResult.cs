namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgeAssignmentCWOResult
{
  public AcknowledgeCWOResult Result { get; set; } = new();
  public int Id { get; set; }
  public int Status { get; set; }
  public bool IsCanceled { get; set; }
  public bool IsCompleted { get; set; }
  public bool IsCompletedSuccessfully { get; set; }
  public int CreationOptions { get; set; }
  public bool IsFaulted { get; set; }
}
