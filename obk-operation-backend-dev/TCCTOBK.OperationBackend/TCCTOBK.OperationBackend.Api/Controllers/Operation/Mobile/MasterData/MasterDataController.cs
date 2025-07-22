using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationsByType;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.OpsAppRoles;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetFunctionRoles;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationByRefId;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetClientSiteByMID;

namespace TCCTOBK.OperationBackend.Api;
[ApiController]
[Route("api/v1/operation/mobile/masterdata")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
public class MasterDataController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public MasterDataController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet("Supervisor")]
  [SwaggerOperation(Summary = "Get List Supervisor")]
  [ProducesResponseType(typeof(List<SupervisorResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetListSupervisor()
  {
    var query = new SupervisorQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Technician")]
  [SwaggerOperation(Summary = "Get List Technician")]
  [ProducesResponseType(typeof(List<TechnicianResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetListTechnician([FromQuery] TechnicianQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("CaseIncident/EventType")]
  [SwaggerOperation(Summary = "Get Event Type ")]
  [ProducesResponseType(typeof(List<CaseincidentEventTypeResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> CaseIncidentEventType()
  {
    var query = new CaseincidentEventTypeQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("CaseIncident/Location")]
  [SwaggerOperation(Summary = "Get Event Type ")]
  [ProducesResponseType(typeof(List<CaseincidentLocationResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> CaseIncidentLocation()
  {

    var query = new CaseincidentLocationQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("OpsAppRoles")]
  [SwaggerOperation(Summary = "Get OpsApp Roles")]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  [ProducesResponseType(typeof(List<OpsAppRolesResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetOpsAppRoles()
  {

    var query = new OpsAppRolesQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Locations")]
  [SwaggerOperation(Summary = "Get Locations by type and parent id")]
  [ProducesResponseType(typeof(List<LocationsByTypeResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetLocationByType([FromQuery] LocationsByTypeQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Location")]
  [SwaggerOperation(Summary = "Get Location by ref id")]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  [ProducesResponseType(typeof(List<LocationByRefIdResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetLocationByRefId([FromQuery] LocationByRefIdQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("FunctionRoles")]
  [SwaggerOperation(Summary = "Get function role list")]
  [ProducesResponseType(typeof(List<GetFunctionRolesResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetFunctionRoles()
  {
    var query = new GetFunctionRolesQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  // cwo type
  [HttpGet("CWOTypes")]
  [SwaggerOperation(Summary = "Get cwo types")]
  [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetCWOType()
  {
    var query = new CWOTypeQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  // // promble type
  // [HttpGet("PrombleTypes")]
  // [SwaggerOperation(Summary = "Get PrombleTypes")]
  // [ProducesResponseType(typeof(List<FMRelatedProblemTypeResult>), (int)HttpStatusCode.OK)]
  // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  // public async Task<IActionResult> GetPrombleTypes()
  // {
  //   var query = new FMRelatedProblemTypeQuery();
  //   var res = await _mediator.Send(query);
  //   return Ok(res);
  // }
  //priority
  [HttpGet("Priority")]
  [SwaggerOperation(Summary = "Get Priority")]
  [ProducesResponseType(typeof(List<GetFunctionRolesResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetPriority()
  {
    var query = new GetFunctionRolesQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }
  //asset
  [HttpGet("Asset")]
  [SwaggerOperation(Summary = "Get Asset")]
  [ProducesResponseType(typeof(List<GetFunctionRolesResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetAsset()
  {
    var query = new GetFunctionRolesQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("ClientSite")]
  [SwaggerOperation(Summary = "Get Client Site")]
  [ProducesResponseType(typeof(List<ClientSite>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetClientSite([FromQuery] ClientSiteQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }


  [HttpGet("ClientSiteByMID")]
  [SwaggerOperation(Summary = "Get Client Site")]
  [ProducesResponseType(typeof(List<GetClientSiteByMIDResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetClientSite([FromQuery] Guid mid)
  {
    var query = new GetClientSiteByMIDQuery(mid);
    var res = await _mediator.Send(query);
    return Ok(res);
  }
}
