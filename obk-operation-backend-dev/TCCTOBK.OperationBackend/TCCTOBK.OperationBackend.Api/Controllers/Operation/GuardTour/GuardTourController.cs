using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskStatus;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusAction;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusSubtask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetAction;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateAction;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateAction;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveAction;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionTypeList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionType;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActionType;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateActionType;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveActionType;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateTaskSubtask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskSubtask;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedure;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.DeleteActivityProcedure;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateActivityProcedure;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedure;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedureList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlanList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlan;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateSchedulePlan;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateSchedulePlan;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveSchedulePlan;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.ProcessSchedulePlan;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPowerList;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftList;

using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpsertShiftManPowerCommand;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveShiftManPower;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateLocation;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveLocation;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateLocation;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocation;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocationList;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckDuplicateActivityProcedure;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckSubtaskDuplicate;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveShift;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateShift;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateShift;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShift;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPower;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Api.Middleware;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.GuardTour;
[Route("api/v1")]
[ApiController]
[ApiExplorerSettings(GroupName = "socv1")]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
public class GuardTourController : ControllerBase
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
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
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
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
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
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateTaskStatusResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateTaskStatus([FromBody] UpdateTaskStatusCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;

		var res = await _mediator.Send(command);
		if (command.StatusId == Constant.GUARD_TOUR_STATUS_CANCELLED)
		{
			try
			{
				var appconfig = Constant.GUATD_TOUR_CANCLE;

				var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
				var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));
				var taskData = await _mediator.Send(new GetTaskQuery(command.TID.ToString(), true));
				messagetemplate = messagetemplate;
				messagetemplaten = messagetemplaten;
				var socuser = await _mediator.Send(new GetSocMemberQuery());
				var socusername = socuser.Data.FirstOrDefault(x => x.Id == taskData.MemberId)?.Name;
				var sendnoti = new SendFCMNotiCommand()
				{
					Message = messagetemplate,
					MessageEn = messagetemplaten,
					FromUser = command.CreatedBy,
					ToUser = taskData.MemberId,
					FromUserName = command.TID.ToString(),
					ToUserName = socusername ?? "",
					NotificationType = Constant.GUARD_TOUR_MESSAGE_TYPE
				};
				await _mediator.Send(sendnoti);
			}
			catch
			{
				return Ok(res);
			}
		}
		return Ok(new SuccessResponse<UpdateTaskStatusResult>(res));
	}

	[HttpPost("TaskSubTasks/create")]
	[SwaggerOperation(Summary = "Create Task and Subtask")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateTaskSubtaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateTaskSubTask([FromBody] CreateTaskSubtaskCommand command)
	{
		// command.CreatedDate = _auditableService.TimeStamp;
		// command.CreatedBy = _auditableService.MID;
		// command.CreatedByName = _auditableService.MemberName;
		// command.UpdatedDate = _auditableService.TimeStamp;
		// command.UpdatedBy = _auditableService.MID;
		// command.UpdatedByName = _auditableService.MemberName;

		command.CreatedDate = DateTime.Now;
		command.CreatedBy = Guid.NewGuid();
		command.CreatedByName = "test";
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = command.CreatedBy;
		command.UpdatedByName = "test";
		var res = await _mediator.Send(command);
		try
		{
			var appconfig = Constant.GUATD_TOUR_ASSIGN;

			var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
			var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));
			messagetemplate = messagetemplate;
			messagetemplaten = messagetemplaten;
			var socuser = await _mediator.Send(new GetSocMemberQuery());
			var socusername = socuser.Data.FirstOrDefault(x => x.Id == command.MemberId)?.Name;
			var sendnoti = new SendFCMNotiCommand()
			{
				Message = messagetemplate,
				MessageEn = messagetemplaten,
				FromUser = command.CreatedBy,
				ToUser = command.MemberId,
				FromUserName = res.Id.ToString(),
				ToUserName = socusername ?? "",
				NotificationType = Constant.GUARD_TOUR_MESSAGE_TYPE,
			};
			await _mediator.Send(sendnoti);
		}
		catch
		{
			return Ok(res);
		}
		return Ok(new SuccessResponse<CreateTaskSubtaskResult>(res));
	}

	[HttpPut("TaskSubTasks/update")]
	[SwaggerOperation(Summary = "Update Task and Subtask")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateTaskSubtaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateTaskSubtask([FromBody] UpdateTaskSubtaskCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateTaskSubtaskResult>(res));
	}

	[HttpGet("Subtasks")]
	[SwaggerOperation(Summary = "Get Subtask List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetSubtaskResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSubtask([FromQuery] GetSubtaskQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Task/CheckDuplicate")]
	[SwaggerOperation(Summary = "Check Duplicate Task")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CheckTaskDuplicateResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckTaskDuplicate([FromBody] CheckTaskDuplicateQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPut("Action/Status")]
	[SwaggerOperation(Summary = "Update Action Status")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateStatusActionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateAction([FromBody] UpdateStatusActionCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateStatusActionResult>(res));
	}

	[HttpPut("Subtask/Status")]
	[SwaggerOperation(Summary = "Update Subtask Status")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateStatusSubtaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateSubtask([FromBody] UpdateStatusSubtaskCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateStatusSubtaskResult>(res));
	}

	[HttpGet("Actions")]
	[SwaggerOperation(Summary = "Get Action List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetActionListResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActions([FromQuery] GetActionListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Action/{id}")]
	[SwaggerOperation(Summary = "Get Action By Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetActionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActionById(string id)
	{
		var query = new GetActionQuery(id, true);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Action")]
	[SwaggerOperation(Summary = "Create Action")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateActionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateAction([FromBody] CreateActionCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;

		// command.CreatedDate = DateTime.Now;
		// command.CreatedBy = Guid.NewGuid();
		// command.CreatedByName = "test";
		// command.UpdatedDate = DateTime.Now;
		// command.UpdatedBy = command.CreatedBy;
		// command.UpdatedByName = "test";
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateActionResult>(res));
	}


	[HttpPut("Action")]
	[SwaggerOperation(Summary = "Update Action")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateActionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateAction([FromBody] UpdateActionCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateActionResult>(res));
	}

	[HttpDelete("Action/{actionId}")]
	[SwaggerOperation(Summary = "Remove Action")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveAction(string actionId)
	{
		var command = new RemoveActionCommand(actionId);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}

	[HttpGet("ActionTypes")]
	[SwaggerOperation(Summary = "Get Action Type List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetActionTypeListResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActionTypes([FromQuery] GetActionTypeListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("ActionType/{id}")]
	[SwaggerOperation(Summary = "Get Action Type By Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetActionTypeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActionTypeById(string id)
	{
		var query = new GetActionTypeQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("ActionType")]
	[SwaggerOperation(Summary = "Create Action Type")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateActionTypeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateActionType([FromBody] CreateActionTypeCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateActionTypeResult>(res));
	}


	[HttpPut("ActionType")]
	[SwaggerOperation(Summary = "Update Action Type")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateActionTypeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateActionType([FromBody] UpdateActionTypeCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateActionTypeResult>(res));
	}

	[HttpDelete("ActionType/{actionId}")]
	[SwaggerOperation(Summary = "Remove Action Type")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveActionType(string actionId)
	{
		var command = new RemoveActionTypeCommand(actionId);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}

	[HttpGet("ActivityProcedures")]
	[SwaggerOperation(Summary = "Get Activity Procedure List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetActivityProcedureListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActicityProcedure([FromQuery] GetActivityProcedureListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("ActivityProcedure/{id}")]
	[SwaggerOperation(Summary = "Get Activity Procedure Detail")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetActivityProcedureResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActicityProcedureDetail(string id, [FromQuery] GetActivityProcedureQuery query)
	{
		query.APID = Guid.Parse(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("ActivityProcedure/CheckDuplicate")]
	[SwaggerOperation(Summary = "CheckDuplicate Activity Procedure")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CheckDuplicateActivityProcedureResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckDuplicateActicityProcedure([FromBody] CheckDuplicateActivityProcedureQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("ActivityProcedure")]
	[SwaggerOperation(Summary = "Create Activity Procedure Detail")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateActivityProcedureResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateActicityProcedure([FromBody] CreateActivityProcedureCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateActivityProcedureResult>(res));
	}

	[HttpPut("ActivityProcedure/{id}")]
	[SwaggerOperation(Summary = "Update Activity Procedure Detail")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateActivityProcedureResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateActicityProcedure(string id, [FromBody] UpdateActivityProcedureCommand command)
	{
		command.Id = Guid.Parse(id);
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateActivityProcedureResult>(res));
	}

	[HttpDelete("ActivityProcedure/{id}")]
	[SwaggerOperation(Summary = "Delete Activity Procedure Detail")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(DeleteActivityProcedureResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DeleteActicityProcedure(string id)
	{
		var command = new DeleteActivityProcedureCommand(id);
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}

	[HttpGet("SchedulePlans")]
	[SwaggerOperation(Summary = "Get Schedule Plan List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetSchedulePlanListResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSchedulePlans([FromQuery] GetSchedulePlanListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("SchedulePlan/{id}")]
	[SwaggerOperation(Summary = "Get Schedule Plan By Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetSchedulePlanResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSchedulePlanById(string id)
	{
		var query = new GetSchedulePlanQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("SchedulePlan")]
	[SwaggerOperation(Summary = "Create Schedule Plan")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateSchedulePlanResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateSchedulePlan([FromBody] CreateSchedulePlanCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateSchedulePlanResult>(res));
	}


	[HttpPut("SchedulePlan")]
	[SwaggerOperation(Summary = "Update Schedule Plan")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateSchedulePlanResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateSchedulePlan([FromBody] UpdateSchedulePlanCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateSchedulePlanResult>(res));
	}

	[HttpDelete("SchedulePlan/{actionId}")]
	[SwaggerOperation(Summary = "Remove Schedule Plan")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveSchedulePlan(string actionId)
	{
		var command = new RemoveSchedulePlanCommand(actionId);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}

	[HttpPost("SchedulePlan/process")]
	[SwaggerOperation(Summary = "Process Schedule Plan")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(ProcessSchedulePlanResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ProcessSchedulePlan([FromBody] ProcessSchedulePlanCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<ProcessSchedulePlanResult>(res));
	}


	[HttpGet("Shift")]
	[SwaggerOperation(Summary = "Get Shift List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetShiftListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetShiftList([FromQuery] GetShiftListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Shift/{id}")]
	[SwaggerOperation(Summary = "Get Shift By Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(mtShift), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetShiftById(int id)
	{
		var query = new GetShiftQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Shift")]
	[SwaggerOperation(Summary = "Create Shift")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateShiftResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateShift([FromBody] CreateShiftCommand command)
	{
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateShiftResult>(res));
	}

	[HttpPut("Shift")]
	[SwaggerOperation(Summary = "Update Shift")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateShiftResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateShift([FromBody] UpdateShiftCommand command)
	{
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateShiftResult>(res));
	}


	[HttpDelete("Shift/{id}")]
	[SwaggerOperation(Summary = "Remove Shift")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveShift(int id)
	{
		var command = new RemoveShiftCommand(id);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}


	[HttpGet("ManPower")]
	[SwaggerOperation(Summary = "Get Man Power List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetShiftManPowerListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetShiftManPowerList([FromQuery] GetShiftManPowerListQuery query)
	{

		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("ManPower/{id}")]
	[SwaggerOperation(Summary = "Get ShiftManPower By Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(mtShiftManPowerRequest), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetShiftManPowerById(int id)
	{
		var query = new GetShiftManPowerQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("ManPower/upsert")]
	[SwaggerOperation(Summary = "Upsert Man Power")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpsertShiftManPowerCommandResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Upsert([FromBody] UpsertShiftManPowerCommandCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpsertShiftManPowerCommandResult>(res));
	}

	[HttpDelete("ManPower/{id}")]
	[SwaggerOperation(Summary = "Remove Man Power")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveShiftManPower(int id)
	{
		var command = new RemoveShiftManPowerCommand(id);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}


	[HttpPost("Location")]
	[SwaggerOperation(Summary = "Create Location")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(CreateLocationResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateLocation([FromBody] CreateLocationCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateLocationResult>(res));
	}

	[HttpDelete("Location/{id}")]
	[SwaggerOperation(Summary = "Remove Action Type")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveLocation(string id)
	{
		var command = new RemoveLocationCommand(id);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}

	[HttpGet("Location")]
	[SwaggerOperation(Summary = "Get Location List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetLocationListResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLocations([FromQuery] GetLocationListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpGet("Location/{id}")]
	[SwaggerOperation(Summary = "Get Location By Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(Location), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLocationById(string id)
	{
		var query = new GetLocationQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpPut("Location")]
	[SwaggerOperation(Summary = "Update Location")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateLocationResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateLocation([FromBody] UpdateLocationCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateLocationResult>(res));
	}

	[HttpGet("User/Member")]
	[SwaggerOperation(Summary = "Get Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetSocMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetUserGuardTour()
	{

		var query = new GetSocMemberQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
