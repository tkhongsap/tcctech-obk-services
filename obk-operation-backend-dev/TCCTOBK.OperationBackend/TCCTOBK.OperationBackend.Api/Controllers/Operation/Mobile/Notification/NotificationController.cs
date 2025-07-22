using System;
using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.ReadNotification;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendAnnounce;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Query.GetNotificationList;
using TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.ChangeLanguestDevice;
using TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.RemoveDevice;
using TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.RemoveDeviceAndToken;
using TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Model;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.Mobile.Notification;

[ApiController]
[Route("api/v1/operation/mobile/notification")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
public class NotificationController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public NotificationController(IMediator mediator)
  {
    _mediator = mediator;
  }
  [HttpPost("Announce")]
  [SwaggerOperation(Summary = "Send announce to opsapp")]
  [ProducesResponseType(typeof(SendAnnounceResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> SendAnnounce([FromBody] SendAnnounceCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }

  [HttpPost("/Send")]
  [SwaggerOperation(Summary = "Send Notification to opsapp")]
  [ProducesResponseType(typeof(SendFCMNotiResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> SendFCMNotification([FromBody] SendFCMNotiCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }

  [HttpPost("ReadNotification")]
  [SwaggerOperation(Summary = "Read Notification opsapp")]
  [ProducesResponseType(typeof(ReadNotificationResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> ReadFCMNotification([FromBody] ReadNotificationCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }

  [HttpGet("{id}")]
  [SwaggerOperation(Summary = "Send Notification to opsapp")]
  [ProducesResponseType(typeof(GetNotificationListResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> SendFCMNotification(Guid id)
  {
    var request = new GetNotificationListQuery()
    {
      MID = id
    };
    var res = await _mediator.Send(request);
    return Ok(res);
  }

  [HttpPost("ChangeAppLangues")]
  [SwaggerOperation(Summary = "Change languest notification opsapp")]
  [ProducesResponseType(typeof(ChangeLanguestDeviceResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> ChangeAppLangues([FromBody] ChangeLanguestDeviceCommand req)
  {
    var data = await _mediator.Send(req);
    return Ok(data);
  }


  [HttpPost("Remove/{deviceid}")]
  [SwaggerOperation(Summary = "remove device id")]
  [ProducesResponseType(typeof(RemoveDeviceResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> RemoveDevice(string deviceid)
  {
    var data = await _mediator.Send(new RemoveDeviceCommand(deviceid));
    return Ok(data);
  }

  [HttpPost("Remove/Device")]
  [SwaggerOperation(Summary = "Remove device when kill auth")]
  [ProducesResponseType(typeof(RemoveDeviceAndTokenResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> RemoveDeviceLogin([FromBody] RemoveDeviceAndTokenCommand request)
  {
    var data = await _mediator.Send(request);
    return Ok(data);
  }


}
