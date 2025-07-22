using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpsertCases;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseList;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCase;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasks;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasksList;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpdateTask;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseLocationOptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCreateCaseForm;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UploadMedia;
using TCCTOBK.OperationBackend.Api.Middleware;

namespace TCCTOBK.OperationBackend.Api;
[ApiController]
[Route("api/v1/operation/mobile/Case")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
public class CaseController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public CaseController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpPost("SyncCase")]
  [SwaggerOperation(Summary = "Sync case, case tasks and case images from certis")]
  [ProducesResponseType(typeof(UpsertCasesResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<ActionResult> UpsertCases([FromBody] UpsertCasesCommand command)
  {
    var res = await _mediator.Send(command);

    return Ok(res);
  }

  [HttpGet("List")]
  [SwaggerOperation(Summary = "Get Case List")]
  [ProducesResponseType(typeof(List<GetCaseListResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> GetTasks([FromQuery] GetCaseListQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("{id}")]
  [SwaggerOperation(Summary = "Get Case By Id")]
  [ProducesResponseType(typeof(GetCaseResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> GetCaseById(int id)
  {
    var query = new GetCaseQuery(id, true);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("CaseTasks/List")]
  [SwaggerOperation(Summary = "Get Case Tasks List")]
  [ProducesResponseType(typeof(List<GetCaseTasksListResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> GetCaseTasks([FromQuery] GetCaseTasksListQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("CaseTasks/{id}")]
  [SwaggerOperation(Summary = "Get Case Tasks By Id")]
  [ProducesResponseType(typeof(GetCaseTasksResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> GetCaseTaskById(int id)
  {
    var query = new GetCaseTasksQuery(id);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpPost("CaseTask/Update")]
  [SwaggerOperation(Summary = "Update Case Task")]
  [ProducesResponseType(typeof(UpdateTaskResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<ActionResult> UpdateCaseTask([FromBody] UpdateTaskCommand command)
  {
    var res = await _mediator.Send(command);
    return Ok(res);
  }

  [HttpGet("Create/Options")]
  [SwaggerOperation(Summary = "Get Create Options")]
  [ProducesResponseType(typeof(GetCreateCaseFormResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> CreateCaseOption()
  {
    var query = new GetCreateCaseFormQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }


  [HttpGet("Create/Location")]
  [SwaggerOperation(Summary = "Get Create Location Options")]
  [ProducesResponseType(typeof(GetCreateCaseLocationOptionsResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> CreateCaseLocationOption([FromQuery] int? typeId, [FromQuery] int? id)
  {
    var query = new GetCreateCaseLocationOptionsQuery(id, typeId);
    var res = await _mediator.Send(query);
    return Ok(res);
  }
  [HttpPost("Adhoc/CreateMedia")]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> AdhocCreateMedia([FromBody] UploadMediaCommand command)
  {
    var res = await _mediator.Send(command);
    return Ok(res);
  }
}
