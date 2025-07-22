using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Query.GetNotificationList;

public class GetNotificationListResult
{
  public int Total { get; set; }
  public int UnReadNotification { get; set; }
  public List<NotificationResult> Notification { get; set; } = new List<NotificationResult>();
}

public class NotificationResult
{
  public Guid OANID { get; set; }
  public string FromUserName { get; set; } = default!;
  public string ToUserName { get; set; } = default!;
  public string Title { get; set; } = default!;
  public string Message { get; set; } = default!;
  public string MessageEN { get; set; } = default!;
  public bool IsRead { get; set; }
  public int WorkId
  {
    get; set;
  }
  public int MessageType { get; set; }
  public string CreatedDate { get; set; }
}