namespace TCCTOBK.OperationBackend.Application;

public class PPMMasterWorkOrder
{
  public string CreatedBy { get; set; }
  public DateTime CreatedOn { get; set; }
  public bool IsEnabled { get; set; }
  public int HolidayActionId { get; set; }
  public int AutoGenerationPatternId { get; set; }
  public int ServiceProviderId { get; set; }
  public DateTime ModifiedOn { get; set; }
  public int ServicingGroupId { get; set; }
  public int MWOTypeId { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public string Title { get; set; }
  public string Name { get; set; }
  public int Id { get; set; }
  public int ServiceCategoryId { get; set; }
  public string ModifiedBy { get; set; }
}
