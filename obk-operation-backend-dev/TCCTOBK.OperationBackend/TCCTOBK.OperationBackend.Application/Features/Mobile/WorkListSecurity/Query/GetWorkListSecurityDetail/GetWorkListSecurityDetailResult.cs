namespace TCCTOBK.OperationBackend.Application;

public class GetWorkListSecurityDetailResult
{
  public int WorkId { get; set; }
  public string WorkName { get; set; } = default!;
  public string TitleImageURL { get; set; } = default!;
  public string Description { get; set; } = default!;
  public string Detail { get; set; } = default!;
}
