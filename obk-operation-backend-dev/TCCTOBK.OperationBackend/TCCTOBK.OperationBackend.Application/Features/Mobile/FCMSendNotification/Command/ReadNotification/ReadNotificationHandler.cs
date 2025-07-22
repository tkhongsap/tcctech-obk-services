using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.ReadNotification;

public class ReadNotificationHandler : IRequestHandler<ReadNotificationCommand, ReadNotificationResult>
{
  IUnitOfWork _uow;

  public ReadNotificationHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<ReadNotificationResult> Handle(ReadNotificationCommand request, CancellationToken cancellationToken)
  {
    await _uow.OpsAppNotificationRepository.Read(request.Id);
    await _uow.SaveChangeAsyncWithCommit();
    return new ReadNotificationResult();
  }
}
