namespace TCCTOBK.OperationBackend.Application;

public class StampTimeSheetResult
{
  public bool IsSuccess { get; set; }
  public StampTimeSheetModel Data { get; set; } = new();
}
