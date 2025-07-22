using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;

public class SendFCMNotiCommand : IRequest<SendFCMNotiResult>
{
  public string Title { get; set; } = "OBK OpsApp";
  public string Message { get; set; } = default!;
  public string MessageEn { get; set; } = default!;
  public Guid FromUser { get; set; }
  public Guid ToUser { get; set; }
  public string FromUserName { get; set; } = "";
  public string ToUserName { get; set; } = "";
  public int NotificationType { get; set; }
  public int workId { get; set; }
}
