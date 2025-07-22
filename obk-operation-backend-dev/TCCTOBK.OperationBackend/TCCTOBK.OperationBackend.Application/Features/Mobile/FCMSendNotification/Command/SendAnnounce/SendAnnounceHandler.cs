using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Service;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendAnnounce;

public class SendAnnounceHandler : IRequestHandler<SendAnnounceCommand, SendAnnounceResult>
{
  IFCMNotificationService _fcmnoti;

  public SendAnnounceHandler(IFCMNotificationService fcmnoti)
  {
    _fcmnoti = fcmnoti;
  }

  public async Task<SendAnnounceResult> Handle(SendAnnounceCommand request, CancellationToken cancellationToken)
  {
    await _fcmnoti.SendNotification(request.title, request.message, request.token);
    return new SendAnnounceResult();
  }
}
