namespace TCCTOBK.OperationBackend.Application;

public class GetWorkListDetailResult
{
  public int WorkId { get; set; }
  public string WorkName { get; set; } = default!;
  public string WorkDescription { get; set; } = default!;
  public List<WorkListDeatil> WorkListDetail { get; set; } = new();
}

public class WorkListDeatil
{
  public int WorkId { get; set; }
  public string WorkName { get; set; } = default!;
  public string TitleImageURL { get; set; } = default!;
  public string Description { get; set; } = default!;
  public string Detail { get; set; } = default!;
}