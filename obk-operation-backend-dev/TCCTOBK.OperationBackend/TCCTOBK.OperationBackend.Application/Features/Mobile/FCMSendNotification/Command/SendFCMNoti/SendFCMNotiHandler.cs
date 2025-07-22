using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Query.GetUserDevice;
using TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Service;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;

public class SendFCMNotiHandler : IRequestHandler<SendFCMNotiCommand, SendFCMNotiResult>
{
  IFCMNotificationService _fcmnoti;
  IUnitOfWork _uow;
  IMediator _mediator;

  public SendFCMNotiHandler(IFCMNotificationService fcmnoti, IUnitOfWork uow, IMediator mediator)
  {
    _fcmnoti = fcmnoti;
    _uow = uow;
    _mediator = mediator;
  }

  public async Task<SendFCMNotiResult> Handle(SendFCMNotiCommand request, CancellationToken cancellationToken)
  {
    var tokenquery = new GetUserDeviceQuery(request.ToUser);
    var tokendevice = await _mediator.Send(tokenquery);
    var resnoti = "";
    var isSendnoti = false;
    foreach (var item in tokendevice)
    {
      var sendmess = request.Message;
      if (item.appLanguest == "en")
      {
        sendmess = request.MessageEn;
      }
      var (res, isSend) = await _fcmnoti.SendNotification("OBK Opsapp", sendmess, item.FcmToken);
      resnoti = res;
      isSendnoti = isSend;
    }
    var savedata = new OpsAppNotification()
    {
      OANID = Guid.Empty,
      FromUser = request.FromUser,
      FromUserName = request.FromUserName,
      ToUser = request.ToUser,
      ToUserName = request.ToUserName,
      UserType = 0,
      MessageEn = request.MessageEn,
      MessageType = request.NotificationType,
      Title = request.Title,
      Message = request.Message,
      IsSendSuccess = isSendnoti,
      FCMResult = resnoti,
      IsRead = false,
      IsActive = isSendnoti,
      CreatedDate = DateTime.Now.ToUniversalTime(),
      WorkId = request.workId
    };
    await _uow.OpsAppNotificationRepository.Create(savedata);
    await _uow.SaveChangeAsyncWithCommit();
    return new SendFCMNotiResult();
  }
}
