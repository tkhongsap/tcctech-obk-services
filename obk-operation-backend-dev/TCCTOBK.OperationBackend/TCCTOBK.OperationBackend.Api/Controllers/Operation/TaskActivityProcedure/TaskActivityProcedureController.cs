using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskActivityProcedureList;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedureByTask;
using TCCTOBK.OperationBackend.Api.Middleware;


namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.TaskActivityProcedure;

[ApiController]
[Route("api/v1/ActivityProcedureByTask/")]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class TaskActivityProcedureController : ControllerBase
{

    private readonly IMediator _mediator;

    private readonly IAuditableService _auditableService;



    public TaskActivityProcedureController(IMediator mediator, IAuditableService auditableService)
    {
        _mediator = mediator;
        _auditableService = auditableService;
    }

    [HttpGet("GetTaskActivity")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
    [SwaggerOperation(Summary = "Get Task Activity Procedure List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
    [ProducesResponseType(typeof(GetTaskActivityProcedureListResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetTaskActicityProcedure([FromQuery] GetTaskActivityProcedureListQuery query)
    {
        var res = await _mediator.Send(query);
        return Ok(res);
    }

    [HttpPost("CreateActivityProcedure/ByTask")]
    [SwaggerOperation(Summary = "Create ActivityProcedure By Task")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
    [ProducesResponseType(typeof(CreateActivityProcedureByTaskResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ProcessSchedulePlan([FromBody] CreateActivityProcedureByTaskCommand command)
    {
        command.CreatedDate = _auditableService.TimeStamp;
        command.CreatedBy = _auditableService.MID;
        command.CreatedByName = _auditableService.MemberName;
        command.UpdatedDate = _auditableService.TimeStamp;
        command.UpdatedBy = _auditableService.MID;
        command.UpdatedByName = _auditableService.MemberName;
        var res = await _mediator.Send(command);
        return Ok(new SuccessResponse<CreateActivityProcedureByTaskResult>(res));
    }

}