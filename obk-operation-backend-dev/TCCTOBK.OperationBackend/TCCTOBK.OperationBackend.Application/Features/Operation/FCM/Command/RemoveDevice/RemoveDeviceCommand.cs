using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.RemoveDevice;

public class RemoveDeviceCommand : IRequest<RemoveDeviceResult>
{
  public string DeviceId { get; set; }
  public RemoveDeviceCommand(string deviceid)
  {
    DeviceId = deviceid;
  }
}
