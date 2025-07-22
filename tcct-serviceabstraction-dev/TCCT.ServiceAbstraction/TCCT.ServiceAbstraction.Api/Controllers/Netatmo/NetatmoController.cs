using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData2;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.ValidateNewHomeScheduleCooling;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpsertUserToken;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.GetListUserToken;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SyncHome;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpdateStatusSync;

namespace TCCT.ServiceAbstraction.Api.Controllers.Netatmo;

[Route("api/v1/netatmo")]
[ApiController]
[ApiExplorerSettings(GroupName = "netatmov1")]

public class NetatmoController : ControllerBase
{
	private readonly IMediator _mediator;
	public NetatmoController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("home/data/{homeId}")]
	[SwaggerOperation(Summary = "Get home data")]
	[ProducesResponseType(typeof(HomeDataResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHomeData(string homeId,[FromQuery] string? tenantId)
	{
		var query = new HomeDataQuery(homeId, tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("home/status/{homeId}")]
	[SwaggerOperation(Summary = "Get home status")]
	[ProducesResponseType(typeof(HomeStatusResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHomeStatus(string homeId, [FromQuery] string? tenantId)
	{
		var query = new HomeStatusQuery(homeId, tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("scenarios/{homeId}")]
	[SwaggerOperation(Summary = "Get scenarios")]
	[ProducesResponseType(typeof(ScenariosResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetScenarios(string homeId, [FromQuery] string? tenantId)
	{
		var query = new ScenariosQuery(homeId, tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpPost("home/schedule/create")]
	[SwaggerOperation(Summary = "Create New Home Schedule")]
	[ProducesResponseType(typeof(CreateNewHomeScheduleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateNewHomeSchedule([FromBody] CreateNewHomeScheduleCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("home/schedule/switch")]
	[SwaggerOperation(Summary = "SwitchHomeSchedule")]
	[ProducesResponseType(typeof(SwitchHomeScheduleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostSwitchHomeSchedule([FromBody] SwitchHomeScheduleRequest body)
	{
		var command = new SwitchHomeScheduleCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}
	[HttpPost("home/setstate")]
	[SwaggerOperation(Summary = "Set state")]
	[ProducesResponseType(typeof(SetStateResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SetState([FromBody] SetStateCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
	[HttpGet("homes/data/all/{homeId}")]
	[SwaggerOperation(Summary = "Get home data")]
	[ProducesResponseType(typeof(HomeDataResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHomeData2(string homeId, [FromQuery] string? tenantId)
	{
		var query = new HomeDataQuery2(homeId, tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("synchomeschedule")]
	[SwaggerOperation(Summary = "Set synchomeschedule")]
	[ProducesResponseType(typeof(SynchomeScheduleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SetSynchomeschedule([FromBody] SynchomeScheduleCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("home/{homeId}/schedule/{scheduleId}")]
	[SwaggerOperation(Summary = "Get home schedule data")]
	[ProducesResponseType(typeof(HomeScheduleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHomeSchedule(string homeId, string scheduleId, [FromQuery] string? tenantId)
	{
		var query = new HomeScheduleQuery(homeId, scheduleId, tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("home/schedule/validate")]
	[SwaggerOperation(Summary = "Validate New Home Schedule Cooling")]
	[ProducesResponseType(typeof(ValidateNewHomeScheduleCoolingResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ValidateNewHomeScheduleCooling([FromBody] ValidateNewHomeScheduleCoolingCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}


	[HttpGet("get-user-token")]
	[SwaggerOperation(Summary = "Get User Token")]
	[ProducesResponseType(typeof(HomeDataResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetListUserToken([FromQuery] string? homeId, [FromQuery] string? tenantId)
	{
		var query = new GetListUserTokenQuery(homeId, tenantId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("upsert-user-token")]
	[SwaggerOperation(Summary = "Create User Token")]
	[ProducesResponseType(typeof(UpsertUserTokenResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpsertUserToken([FromBody] UpsertUserTokenCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("update-status-sync")]
	[SwaggerOperation(Summary = "Update User Token Mapping Sync Status")]
	[ProducesResponseType(typeof(UpdateStatusSyncResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateStatusSync([FromBody] UpdateStatusSyncCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("sync-home")]
	[SwaggerOperation(Summary = "Sync Home")]
	[ProducesResponseType(typeof(SyncHomeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SyncHome([FromBody] SyncHomeCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
}
