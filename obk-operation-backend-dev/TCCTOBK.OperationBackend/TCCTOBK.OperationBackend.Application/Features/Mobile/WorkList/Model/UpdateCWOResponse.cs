namespace TCCTOBK.OperationBackend.Application;

public class UpdateCWOResponse
{
  public List<UpdateCWOResult> Result { get; set; }

  public int Id { get; set; }
  public int Status { get; set; }
  public bool IsCanceled { get; set; }
  public bool IsCompleted { get; set; }
  public bool IsCompletedSuccessfully { get; set; }
  public int CreationOptions { get; set; }
  public bool IsFaulted { get; set; }
}

public class UpdateCWOResult
{
  public int id { get; set; }
  public int cwoId { get; set; }
  public int taskId { get; set; }
  public string? taskStatus { get; set; }
  public string? remarks { get; set; }
  public string? reading { get; set; }
  public int taskNo { get; set; }
  public string? description { get; set; }
  public int checklistId { get; set; }
  public bool isMandatory { get; set; }
  public bool isAttachmentRequired { get; set; }
  public bool isReadingRequired { get; set; }
  public bool isRatingRequired { get; set; }
  public string? createdBy { get; set; }
  public DateTime createdOn { get; set; }
  public string? modifiedBy { get; set; }
  public DateTime modifiedOn { get; set; }
}