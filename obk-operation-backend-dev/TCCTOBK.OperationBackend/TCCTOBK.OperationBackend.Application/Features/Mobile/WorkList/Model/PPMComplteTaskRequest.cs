namespace TCCTOBK.OperationBackend.Application;

public class PPMComplteTaskRequest
{
  public PPMComplteTaskRequest(int workOrderId, string completionComment, string completionSignature, Guid completedBy)
  {
    WorkOrderId = workOrderId;
    CompletionComment = completionComment;
    CompletionSignature = completionSignature;
    CompletedBy = completedBy;
  }

  public int WorkOrderId { get; set; }
  public string CompletionComment { get; set; }
  public string CompletionSignature { get; set; }
  public Guid CompletedBy { get; set; }
}
