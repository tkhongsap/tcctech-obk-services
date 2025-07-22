namespace TCCTOBK.OperationBackend.Application;

public class CommentPPMRequestModel
{
  public int workOrderId { get; set; }
  public int commentTypeId { get; set; }
  public string comment { get; set; }
  public DateTime commentedOn { get; set; }
  public Guid commentedBy { get; set; }
}
