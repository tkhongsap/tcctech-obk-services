namespace TCCTOBK.OperationBackend.Application;

public class PPMTaskModel
{
  public int Id { get; set; }
  public int WOId { get; set; }
  public int ServicingObjectId { get; set; }
  public int TaskId { get; set; }
  public TaskPPM Task { get; set; }
  public int TaskNo { get; set; }
  public string Description { get; set; }
  public bool IsMandatory { get; set; }
  public bool IsAttachmentRequired { get; set; }
  public bool IsReadingRequired { get; set; }
  public bool IsRatingRequired { get; set; }
  public DateTime ModifiedOn { get; set; }
  public string? TaskStatus { get; set; }
  public string ModifiedBy { get; set; }
}

public class TaskPPM
{
  public int Id { get; set; }
  public int TaskNo { get; set; }
  public string Description { get; set; } = string.Empty;
  public int ChecklistId { get; set; }
  public bool IsMandatory { get; set; }
  public bool IsAttachmentRequired { get; set; }
  public bool IsReadingRequired { get; set; }
  public int Duration { get; set; }
  public string IconData { get; set; } = null!;
  public string IconMimeType { get; set; } = null!;
  public string IconName { get; set; } = null!;
  public bool IsRatingRequired { get; set; }
  public string TaskStatus { get; set; }
}
