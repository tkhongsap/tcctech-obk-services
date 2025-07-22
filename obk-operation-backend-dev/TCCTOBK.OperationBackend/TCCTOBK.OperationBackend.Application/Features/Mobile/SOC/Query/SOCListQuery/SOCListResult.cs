namespace TCCTOBK.OperationBackend.Application;

public class SOCListResult
{
  public int CWOID { get; set; }
  public int ProblemType { get; set; } = default!;
  public string Title { get; set; } = default!;
  public string Description { get; set; } = default!;
  public string CreatedDate { get; set; } = default!;
  public string Priority { get; set; } = default!;
  public int Status { get; set; }
  public string Location { get; set; } = default!;
}
