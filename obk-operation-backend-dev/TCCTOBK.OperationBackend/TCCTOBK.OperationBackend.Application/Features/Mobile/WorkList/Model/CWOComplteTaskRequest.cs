namespace TCCTOBK.OperationBackend.Application;

public class CWOComplteTaskRequest
{
  public CWOComplteTaskRequest(int cwoId, string completionComment, string completionAckedBy, string completionSignature, string completedBy, int locationId, string description, int requesterId, int assetid)
  {
    CwoId = cwoId;
    CompletionComment = completionComment;
    CompletionAckedBy = completionAckedBy;
    CompletionSignature = completionSignature;
    CompletedBy = completedBy;
    LocationId = locationId;
    Description = description;
    RequesterId = requesterId;
    AssetId = assetid;
  }

  public int CwoId { get; set; }
  public string CompletionComment { get; set; }
  public string CompletionAckedBy { get; set; }
  public string CompletionSignature { get; set; }
  public string CompletedBy { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public int AssetId { get; set; }
}
