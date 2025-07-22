namespace TCCTOBK.OperationBackend.Application;

public class CheckTimeSheetResult
{
  public bool isCheckIn { get; set; } = false;
  public bool isCheckOut { get; set; } = false;
  public DateTime? CheckInDate { get; set; }
  public string? CheckInDateText { get; set; } = default!;
  public string? CheckInTimeText { get; set; } = default!;
  public DateTime? CheckOutDate { get; set; }
  public string? CheckOutDateText { get; set; }
  public string? CheckOutTimeText { get; set; }
  public int? Location { get; set; }
  public int? Asset { get; set; }
}
