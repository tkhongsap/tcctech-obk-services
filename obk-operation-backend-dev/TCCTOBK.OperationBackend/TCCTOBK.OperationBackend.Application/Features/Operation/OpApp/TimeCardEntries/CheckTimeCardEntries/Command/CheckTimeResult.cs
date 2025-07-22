namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class CheckTimeResult
{
  public string CheckInCode { get; set; } = default!;
  public DateTime CheckIn { get; set; } = default!;
  public string CheckInString { get; set; } = default!;
  public DateTime? CheckOut { get; set; } = default!;
  public string? CheckOutString { get; set; } = default!;
}
