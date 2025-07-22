using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.RemoveDeviceAndToken;

public class RemoveDeviceAndTokenCommand : IRequest<RemoveDeviceAndTokenResult>
{
  public string DeviceId { get; set; } = default!;
  public string FCMToken { get; set; } = default!;
}
