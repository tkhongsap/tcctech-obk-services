namespace TCCTOBK.OperationBackend.Application;

public class ProblemTypesResult
{
  public int Id { get; set; }
  public string? Name { get; set; }
  public int PriorityId { get; set; }
  public int ServiceCategoryId { get; set; }
  public int ChecklistId { get; set; }
}
