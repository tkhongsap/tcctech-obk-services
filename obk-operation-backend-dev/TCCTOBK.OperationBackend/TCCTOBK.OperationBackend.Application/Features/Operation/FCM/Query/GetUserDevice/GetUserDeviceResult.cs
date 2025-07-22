using System;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Query.GetUserDevice;

public class GetUserDeviceResult
{
  public Guid Id { get; set; }
  public string DeviceId { get; set; } = default!;
  public string FcmToken { get; set; } = default!;
  public string Platform { get; set; } = default!;
  public string AppVersion { get; set; } = default!;
  public Guid MemberId { get; set; }
  public bool IsActive { get; set; }
  public string appLanguest { get; set; }
}
