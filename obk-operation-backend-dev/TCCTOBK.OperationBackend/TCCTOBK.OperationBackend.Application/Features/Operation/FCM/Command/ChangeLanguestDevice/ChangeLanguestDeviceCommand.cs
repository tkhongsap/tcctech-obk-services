using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.ChangeLanguestDevice;

public class ChangeLanguestDeviceCommand : IRequest<ChangeLanguestDeviceResult>
{
  public string DeviceId { get; set; }
  public string FCMToken { get; set; }
  public string Code { get; set; }
  public Guid UserId { get; set; }
  public ChangeLanguestDeviceCommand(string deviceid, string fcmtoken, string code, Guid userid)
  {
    DeviceId = deviceid;
    FCMToken = fcmtoken;
    Code = code;
    UserId = userid;
  }
}
