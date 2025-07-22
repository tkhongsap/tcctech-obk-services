using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.ChangeLanguestDevice;

public class ChangeLanguestDeviceHandler : IRequestHandler<ChangeLanguestDeviceCommand, ChangeLanguestDeviceResult>
{
  private readonly IUnitOfWork _uow;

  public ChangeLanguestDeviceHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<ChangeLanguestDeviceResult> Handle(ChangeLanguestDeviceCommand request, CancellationToken cancellationToken)
  {
    await _uow.FCMRepository.UpdateAppLanguest(request.DeviceId, request.FCMToken, request.Code, request.UserId);
    await _uow.SaveChangeAsyncWithCommit();
    return new ChangeLanguestDeviceResult();
  }
}
