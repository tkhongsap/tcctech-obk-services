namespace TCCTOBK.OperationBackend.Application;

public class CreateSOCIncidentModel
{
  public DateTime RequestedOn { get; set; }
  public int PriorityId { get; set; }
  public int RequesterId { get; set; }
  public int LocationId { get; set; }
  public int AssetId { get; set; }
  public int CWOTypeId { get; set; }
  public int ServiceCategoryId { get; set; }
  public int ProblemTypeId { get; set; }
  public Guid CreatedBy { get; set; }
  public string Description { get; set; }
}
