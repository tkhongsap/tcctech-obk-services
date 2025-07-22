using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Refit;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;
using TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMComment;
using TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMTransection;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskStatus;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Command.UpsertPPM;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Api;
[ApiController]
[Route("api/v1/operation/mobile/ppm")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
[MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
public class PPMController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public PPMController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet()]
  [SwaggerOperation(Summary = "Get List PPM")]
  [ProducesResponseType(typeof(PPMListResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> GetList([FromQuery] string userid, int? role, int? status)
  {
    var query = new PPMListQuery(userid, role, status);
    var res = await _mediator.Send(query);
    return Ok(res);
  }
  [HttpGet("Detail")]
  [SwaggerOperation(Summary = "Get PPM Detail By ID")]
  [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> PPMDetail([FromQuery] int id)
  {
    var query = new PPMDetailQuery(id);
    var res = await _mediator.Send(query);
    return Ok(res);
  }
  [HttpPost("Assign/Technician")]
  [SwaggerOperation(Summary = "Assign Technician ")]
  [ProducesResponseType(typeof(AssignTechnicianPPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> AssignTechnician([FromBody] AssignTechnicianPPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.PPM_ASSIGN;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, PPMId = request.workOrderId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Reject/Supervisor")]
  [SwaggerOperation(Summary = "Supervisor Reject")]
  [ProducesResponseType(typeof(RejectSupervisorPPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> RejectSupervisor([FromBody] RejectSupervisorPPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.PPM_REJECT;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.rejectedBy, SendTo = request.rejectedBy, PPMId = request.workOrderId });
    }
    catch
    {
      return Ok(res);
    }

    return Ok(res);
  }
  [HttpPost("Reject/Technician")]
  [SwaggerOperation(Summary = "Technician Reject")]
  [ProducesResponseType(typeof(RejectTechnicianPPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> RejectTechnician([FromBody] RejectTechnicianPPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.PPM_REJECT;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, PPMId = request.workOrderId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Acknowledge")]
  [SwaggerOperation(Summary = "Technicain Acknowledge")]
  [ProducesResponseType(typeof(AcknowlegePPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> TechnicainAcknowledge([FromBody] AcknowlegePPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.PPM_ACK;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, PPMId = request.WorkOrderId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Task/Update")]
  [SwaggerOperation(Summary = "Technicain Update Task")]
  [ProducesResponseType(typeof(TaskUpdatePPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> TechnicainUpdateTask([FromBody] TaskUpdatePPMCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }

  [HttpPost("Completed")]
  [SwaggerOperation(Summary = "Technicain Completed")]
  [ProducesResponseType(typeof(CompletedPPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> TechnicainCompleted([FromBody] CompletedPPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.PPM_COMPLETE;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, PPMId = request.WorkOrderId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Close")]
  [SwaggerOperation(Summary = "Supervisor Close")]
  [ProducesResponseType(typeof(ClosePPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> SupervisorClose([FromBody] ClosePPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.PPM_CLOSE;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, PPMId = request.workOrderId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Rework")]
  [SwaggerOperation(Summary = "Supervisor Rework")]
  [ProducesResponseType(typeof(ReworkPPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> SupervisorRework([FromBody] ReworkPPMCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.PPM_REWORK;
      await _mediator.Send(new UpsertPPMCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, PPMId = request.workOrderId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpGet("Comment")]
  [SwaggerOperation(Summary = "Get PPM Comment By ID")]
  [ProducesResponseType(typeof(PPMCommentResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> GetPPMComment([FromQuery] int id)
  {
    var query = new PPMCommentQuery(id);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Transaction")]
  [SwaggerOperation(Summary = "Get PPM Transaction By ID")]
  [ProducesResponseType(typeof(List<PPMTransectionResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> GetPPMTransaction([FromQuery] int id)
  {
    var query = new PPMTransectionQuery(id);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpPost("ConfirmCompleted")]
  [SwaggerOperation(Summary = "Technicain Confirm Completed")]
  [ProducesResponseType(typeof(ConfirmCompletePPMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

  public async Task<IActionResult> TechnicainConfirmComplete([FromBody] ConfirmCompletePPMCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }
}
