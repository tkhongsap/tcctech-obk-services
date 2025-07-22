using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Query.GetNotificationList;

public class GetNotificationListHandler : IRequestHandler<GetNotificationListQuery, GetNotificationListResult>
{
  IUnitOfWork _uow;

  public GetNotificationListHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }

  public async Task<GetNotificationListResult> Handle(GetNotificationListQuery request, CancellationToken cancellationToken)
  {
    var data = await _uow.OpsAppNotificationRepository.GetByUser(request.MID);
    data = data.OrderByDescending(x => x.CreatedDate).ToList();
    var noti = data.Select(x => new NotificationResult()
    {
      OANID = x.OANID,
      FromUserName = x.FromUserName,
      ToUserName = x.ToUserName,
      Title = x.Title,
      Message = x.Message,
      MessageEN = x.MessageEn,
      IsRead = x.IsRead,
      CreatedDate = GetTimeDifferenceDescription(x.CreatedDate),
      MessageType = x.MessageType,
      WorkId = x.WorkId
    }).ToList();
    var res = new GetNotificationListResult();
    res.Total = noti.Count();
    res.UnReadNotification = noti.Where(x => x.IsRead == false).Count();
    res.Notification = noti;
    return res;
  }

  static string GetTimeDifferenceDescription(DateTime pastDateTime)
  {
    TimeSpan timeDifference = DateTime.Now.ToUniversalTime() - pastDateTime.ToUniversalTime();

    if (timeDifference.TotalSeconds < 60)
      return $"{(int)timeDifference.TotalSeconds} seconds ago";
    else if (timeDifference.TotalMinutes < 60)
      return $"{(int)timeDifference.TotalMinutes} minute{(timeDifference.TotalMinutes < 2 ? "" : "s")} ago";
    else if (timeDifference.TotalHours < 24)
      return $"{(int)timeDifference.TotalHours} hour{(timeDifference.TotalHours < 2 ? "" : "s")} ago";
    else if (timeDifference.TotalDays < 30)
      return $"{(int)timeDifference.TotalDays} day{(timeDifference.TotalDays < 2 ? "" : "s")} ago";
    else if (timeDifference.TotalDays < 365)
      return $"{(int)(timeDifference.TotalDays / 30)} month{((timeDifference.TotalDays / 30) < 2 ? "" : "s")} ago";
    else
      return $"{(int)(timeDifference.TotalDays / 365)} year{((timeDifference.TotalDays / 365) < 2 ? "" : "s")} ago";
  }
}
