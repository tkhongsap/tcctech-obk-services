using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.ReadNotification;

public class ReadNotificationCommand : IRequest<ReadNotificationResult>
{
  public Guid Id { get; set; }
}
