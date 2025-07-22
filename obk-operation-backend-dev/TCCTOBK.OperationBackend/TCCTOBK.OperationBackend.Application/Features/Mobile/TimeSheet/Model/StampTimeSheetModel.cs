namespace TCCTOBK.OperationBackend.Application;

public class StampTimeSheetModel
{
  public string KCusername { get; set; } = default!;
  public int Location { get; set; }
  public DateTime CheckInDate { get; set; }
  public string CheckInDateText { get; set; } = default!;
  public string CheckInTimeText { get; set; } = default!;
  public DateTime? CheckOutDate { get; set; }
  public string? CheckOutDateText { get; set; } = default!;
  public string? CheckOutTimeText { get; set; } = default!;
}
