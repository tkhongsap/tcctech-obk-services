using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Query.GetNotificationList;

public class GetNotificationListQuery : IRequest<GetNotificationListResult>
{
  public Guid MID { get; set; } // kc username
}
