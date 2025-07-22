using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.CWOComponents;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.CWOSupervisor;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.OptionsCWO;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Command.UpsertCWO;
using TCCTOBK.OperationBackend.Api.Middleware;

namespace TCCTOBK.OperationBackend.Api;
[ApiController]
[Route("api/v1/operation/mobile/cwo")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
public class CWOController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public CWOController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet("")]
  [SwaggerOperation(Summary = "Get List CWO")]
  [ProducesResponseType(typeof(CWOListResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  public async Task<IActionResult> CWO([FromQuery] string userid, int? role)
  {
    var query = new CWOListQuery(userid, role);
    var res = await _mediator.Send(query);
    return Ok(res);
  }
  [HttpPost("")]
  [SwaggerOperation(Summary = "CWO")]
  [ProducesResponseType(typeof(CreateCWOResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  public async Task<IActionResult> CreateCWO([FromBody] CreateCWOCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }
  [HttpGet("Detail")]
  [SwaggerOperation(Summary = "Get CWO Detail By ID")]
  [ProducesResponseType(typeof(CWODetailResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  public async Task<IActionResult> CWODetail([FromQuery] int cwoid)
  {
    var data = new CWODetailQuery(cwoid);
    var res = await _mediator.Send(data);
    return Ok(res);
  }
  [HttpPost("Assign/Technician")]
  [SwaggerOperation(Summary = "Assign Technician ")]
  [ProducesResponseType(typeof(AssignTechnicianResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  public async Task<IActionResult> AssignTechnician([FromBody] AssignTechnicianCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      //find mozart id conver to mid
      var appconfig = Constant.CWO_ASSIGN;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.CWOId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Reject/Technician")]
  [SwaggerOperation(Summary = "Technician Reject")]
  [ProducesResponseType(typeof(RejectTechnicianResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  public async Task<IActionResult> RejectTechnician([FromBody] RejectTechnicianCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_REJECT;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.CWOId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Reject/Supervisor")]
  [SwaggerOperation(Summary = "Supervisor Reject")]
  [ProducesResponseType(typeof(RejectSupervisorResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> RejectSupervisor([FromBody] RejectSupervisorCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1 });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Acknowledge")]
  [SwaggerOperation(Summary = "Technicain Acknowledge")]
  [ProducesResponseType(typeof(TechnicainAcknowledgeResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> TechnicainAcknowledge([FromBody] TechnicainAcknowledgeCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_ACK;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.CwoId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Pause")]
  [SwaggerOperation(Summary = "Technicain Pause")]
  [ProducesResponseType(typeof(PauseWorkCWOResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> TechnicainPause([FromBody] PauseWorkCWOCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_PAUSE;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.cwoId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Resume")]
  [SwaggerOperation(Summary = "Technicain Resume")]
  [ProducesResponseType(typeof(ResumeCWOResponse), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> TechnicainResume([FromBody] ResumeWorkCWOCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_RESUME;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.cwoId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Completed")]
  [SwaggerOperation(Summary = "Technicain Completed")]
  [ProducesResponseType(typeof(CompleteCWOResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> TechnicainCompleted([FromBody] CompleteCWOCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_COMPLETE;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.CwoId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Close")]
  [SwaggerOperation(Summary = "Supervisor Close")]
  [ProducesResponseType(typeof(CloseCWOResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> SupervisorClose([FromBody] CloseCWOCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_CLOSE;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.cwoId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpPost("Rework")]
  [SwaggerOperation(Summary = "Supervisor Rework")]
  [ProducesResponseType(typeof(ReworkCWOResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> SupervisorRework([FromBody] ReworkCWOCommand request)
  {
    var res = await _mediator.Send(request);
    try
    {
      var appconfig = Constant.CWO_REWORK;
      await _mediator.Send(new UpsertCWOCommand() { LastMinute = 1, MessageTemplate = appconfig, SendFrom = request.SendFrom, SendTo = request.SendTo, CWOId = request.cwoId });
    }
    catch
    {
      return Ok(res);
    }
    return Ok(res);
  }
  [HttpGet("Transactions/{cwoId}")]
  [SwaggerOperation(Summary = "Get CWO transactions")]
  [ProducesResponseType(typeof(List<CWOTransactionsResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> Transactions(int cwoId)
  {
    var query = new CWOTransactionsQuery(cwoId);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Options")]
  [SwaggerOperation(Summary = "Get Create CWO Dropdown")]
  [ProducesResponseType(typeof(List<OptionsCWOResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> CreateOptionsCWO(int componentid)
  {
    var query = new OptionsCWOQuery(componentid);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Component")]
  [SwaggerOperation(Summary = "Get Create CWO Component")]
  [ProducesResponseType(typeof(List<CWOComponentsResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> GetComponent()
  {
    var query = new CWOComponentsQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Supervisor")]
  [SwaggerOperation(Summary = "Get Create CWO Supervisor")]
  [ProducesResponseType(typeof(List<CWOSupervisorResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]

  public async Task<IActionResult> GetSupervisor()
  {
    var query = new CWOSupervisorQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpPost("SyncCWO")]
  [SwaggerOperation(Summary = "Sync CWO")]
  [ProducesResponseType(typeof(UpsertCWOResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<ActionResult> UpsertCWO([FromBody] UpsertCWOCommand command)
  {
    var res = await _mediator.Send(command);

    return Ok(res);
  }
}
