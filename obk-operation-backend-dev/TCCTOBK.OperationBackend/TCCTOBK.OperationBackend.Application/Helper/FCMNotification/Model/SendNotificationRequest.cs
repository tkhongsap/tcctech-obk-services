using System;
using Amazon.SimpleEmail.Model;

namespace TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Model;

public class SendNotificationRequest
{
  public string Title { get; set; } = default!;
  public string Body { get; set; } = default!;
}
