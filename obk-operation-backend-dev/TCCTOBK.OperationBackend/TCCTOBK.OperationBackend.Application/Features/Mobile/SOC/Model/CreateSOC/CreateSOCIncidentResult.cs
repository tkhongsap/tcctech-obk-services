namespace TCCTOBK.OperationBackend.Application;

public class CreateSOCIncidentResult
{
  public Result Result { get; set; }
  public int Id { get; set; }
  public int Status { get; set; }
  public bool IsCanceled { get; set; }
  public bool IsCompleted { get; set; }
  public bool IsCompletedSuccessfully { get; set; }
  public int CreationOptions { get; set; }
  public bool IsFaulted { get; set; }
}

public class Result
{
  public int Id { get; set; }
  public string? Name { get; set; }
  public int CWOTypeId { get; set; }
  public int ProblemTypeId { get; set; }
  public fmProblemType FMProblemType { get; set; } = new();

}

public class fmProblemType
{
  public int Id { get; set; }
  public string? Name { get; set; }
  public int PriorityId { get; set; }
  public int ServiceCategoryId { get; set; }
  public int ChecklistId { get; set; }
  public List<string> CWOs { get; set; } = new();
}