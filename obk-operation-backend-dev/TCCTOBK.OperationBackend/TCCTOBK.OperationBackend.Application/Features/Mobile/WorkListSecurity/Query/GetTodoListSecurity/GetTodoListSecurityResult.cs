namespace TCCTOBK.OperationBackend.Application;

public class GetTodoListSecurityResult
{
  public DateTime ToDoDate { get; set; }
  public string ToDoTimeString { get; set; } = default!;
  public string ToDoTitle { get; set; } = default!;
  public int Location { get; set; } = default!;
  public string LocationText { get; set; } = default!;
  public int WorkId { get; set; }
  public string Name { get; set; } = default!;
  public string WorkType { get; set; } = default!;
  public int Status { get; set; } = default!;
  public string StatusText { get; set; } = default!;
  public int TaskId { get; set; } = default!;
  public int? MasterID { get; set; }
  public string Color { get; set; } = default!;
}
