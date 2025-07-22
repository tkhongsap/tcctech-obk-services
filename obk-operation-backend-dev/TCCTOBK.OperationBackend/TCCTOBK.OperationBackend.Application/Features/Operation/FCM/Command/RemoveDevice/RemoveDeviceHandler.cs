using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.RemoveDevice;

public class RemoveDeviceHandler : IRequestHandler<RemoveDeviceCommand, RemoveDeviceResult>
{
  private readonly IUnitOfWork _uow;

  public RemoveDeviceHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<RemoveDeviceResult> Handle(RemoveDeviceCommand request, CancellationToken cancellationToken)
  {
    _ = await _uow.FCMRepository.RemoveByDeviceId(request.DeviceId);
    await _uow.SaveChangeAsyncWithCommit();
    return new RemoveDeviceResult();
  }
}
