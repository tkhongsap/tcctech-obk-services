using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.RemoveDeviceAndToken;

public class RemoveDeviceAndTokenHandler : IRequestHandler<RemoveDeviceAndTokenCommand, RemoveDeviceAndTokenResult>
{
  private readonly IUnitOfWork _uow;

  public RemoveDeviceAndTokenHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<RemoveDeviceAndTokenResult> Handle(RemoveDeviceAndTokenCommand request, CancellationToken cancellationToken)
  {
    await _uow.FCMRepository.RemoveToken(request.DeviceId, request.FCMToken);
    await _uow.SaveChangeAsyncWithCommit();
    return new RemoveDeviceAndTokenResult();
  }
}
