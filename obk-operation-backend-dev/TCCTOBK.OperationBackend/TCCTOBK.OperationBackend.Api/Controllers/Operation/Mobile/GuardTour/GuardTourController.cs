using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskStatus;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusAction;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusSubtask;
using TCCTOBK.OperationBackend.Application.Helper.Service;

using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Api.Middleware;

namespace TCCTOBK.OperationBackend.Api;
[Route("api/v1/operation/mobile/guard-tour")]
[ApiController]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
[MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
public class GuardTourController : OperationApiControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;

	public GuardTourController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpGet("Tasks")]
	[SwaggerOperation(Summary = "Get Task List")]
	[ProducesResponseType(typeof(List<GetTaskListResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTasks([FromQuery] GetTaskListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpGet("Task/{id}")]
	[SwaggerOperation(Summary = "Get Task By Id")]
	[ProducesResponseType(typeof(GetTaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTaskById(string id)
	{
		var query = new GetTaskQuery(id, true);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPut("Task/status")]
	[SwaggerOperation(Summary = "Update Task Status")]
	[ProducesResponseType(typeof(UpdateTaskStatusResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateTaskStatus([FromBody] UpdateTaskStatusCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = new Guid();
		command.UpdatedByName = command.UpdatedByName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateTaskStatusResult>(res));
	}

	[HttpGet("Subtasks")]
	[SwaggerOperation(Summary = "Get Subtask List")]
	[ProducesResponseType(typeof(List<GetSubtaskResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSubtask([FromQuery] GetSubtaskQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPut("Action/Status")]
	[SwaggerOperation(Summary = "Update Action Status")]
	[ProducesResponseType(typeof(UpdateStatusActionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateAction([FromBody] UpdateStatusActionCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = new Guid();
		command.UpdatedByName = command.UpdatedByName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateStatusActionResult>(res));
	}

	[HttpPut("Subtask/Status")]
	[SwaggerOperation(Summary = "Update Subtask Status")]
	[ProducesResponseType(typeof(UpdateStatusSubtaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateSubtask([FromBody] UpdateStatusSubtaskCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = new Guid();
		command.UpdatedByName = command.UpdatedByName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateStatusSubtaskResult>(res));
	}
}
