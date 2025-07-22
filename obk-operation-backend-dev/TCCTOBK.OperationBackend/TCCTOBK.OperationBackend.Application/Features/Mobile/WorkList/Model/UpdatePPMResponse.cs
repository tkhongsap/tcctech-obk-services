namespace TCCTOBK.OperationBackend.Application;

public class UpdatePPMResponse
{
  public List<UpdatePPMResult> Result { get; set; }
  public int Id { get; set; }
  public int Status { get; set; }
  public bool IsCanceled { get; set; }
  public bool IsCompleted { get; set; }
  public bool IsCompletedSuccessfully { get; set; }
  public int CreationOptions { get; set; }
  public bool IsFaulted { get; set; }
}

public class UpdatePPMResult
{
  public int id { get; set; }
  public int woId { get; set; }
  public int servicingObjectId { get; set; }
  public int taskId { get; set; }
  public string taskStatus { get; set; }
  public string reading { get; set; }
  public string remarks { get; set; }
  public int taskNo { get; set; }
  public string description { get; set; }
  public bool isMandatory { get; set; }
  public bool isAttachmentRequired { get; set; }
  public bool isReadingRequired { get; set; }
  public bool isRatingRequired { get; set; }
  public DateTime modifiedOn { get; set; }
  public string modifiedBy { get; set; }
}
