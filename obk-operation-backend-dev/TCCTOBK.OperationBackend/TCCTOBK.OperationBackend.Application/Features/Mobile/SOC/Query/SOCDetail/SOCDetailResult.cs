namespace TCCTOBK.OperationBackend.Application;

public class SOCDetailResult
{
  public string? Description { get; set; }
  public string Status { get; set; } = default!;
  public string CaseNo { get; set; } = default!;
  public string Date { get; set; } = default!;
  public string Time { get; set; } = default!;
  public string Location { get; set; } = default!;
  public string Critical { get; set; } = default!;
  public string Priority { get; set; } = default!;
  public string SLA { get; set; } = default!;
  public string SLATime { get; set; } = default!;
  public List<TaskSOC> Task { get; set; } = new();
}

public class TaskSOC
{
  public int Id { get; set; }
  public string Title { get; set; } = default!;
}