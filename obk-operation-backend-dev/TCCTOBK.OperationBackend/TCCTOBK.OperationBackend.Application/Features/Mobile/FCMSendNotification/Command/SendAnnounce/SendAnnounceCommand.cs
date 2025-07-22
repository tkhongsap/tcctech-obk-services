using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendAnnounce;

public class SendAnnounceCommand : IRequest<SendAnnounceResult>
{
  public string title { get; set; }
  public string message { get; set; }
  public string token { get; set; }
}
