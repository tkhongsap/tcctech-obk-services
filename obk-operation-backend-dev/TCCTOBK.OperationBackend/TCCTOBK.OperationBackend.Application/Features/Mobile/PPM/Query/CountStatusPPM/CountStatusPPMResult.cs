namespace TCCTOBK.OperationBackend.Application;

public class CountStatusPPMResult
{
  public int NewCount { get; set; }
  public int AssignedCount { get; set; }
  public int CompletedCount { get; set; }
  public int ClosedCount { get; set; }
  public int RejectedCount { get; set; }
}
