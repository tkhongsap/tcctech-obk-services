namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class GetQRCodeResult
{
  public List<QRData> QRData { get; set; } = new();
}

public class QRData
{
  public string Data { get; set; } = default!;
  public int Location { get; set; }
}