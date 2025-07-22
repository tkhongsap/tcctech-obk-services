using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.EventLogs.Command.CreateEventLog;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.Summary;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.SyncSummary;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.RemoveRoster;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRoster;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterList;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterStaff;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.RemoveStaff;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.UpsertStaff;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaff;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffByComponent;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffList;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.UsageMonitoring;

[ApiController]
[Route("api/v1/usageMonitoring/")]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class UsageMonitoringController : ControllerBase
{
	private readonly IMediator _mediator;
    private readonly IAuditableService _auditableService;
    public UsageMonitoringController(IMediator mediator, IAuditableService auditableService)
    {
        _mediator = mediator;
        _auditableService = auditableService;
	}

	[HttpGet("Staff")]
	[SwaggerOperation(Summary = "Staff List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetStaffListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> StaffList([FromQuery] GetStaffListQuery data)
	{
		var res = await _mediator.Send(data);
		return Ok(res);
	}
	[HttpGet("Staff/{sfid}")]
	[SwaggerOperation(Summary = "Get Staff By Id")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetStaffResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetStaffById(Guid sfid)
	{
		var query = new GetStaffQuery(sfid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Staff/upsert")]
	[SwaggerOperation(Summary = "Upsert Staff")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpsertStaffResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Upsert([FromBody] UpsertStaffCommand command)
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
		return Ok(new SuccessResponse<UpsertStaffResult>(res));
	}


	[HttpDelete("Staff/{sfid}")]
	[SwaggerOperation(Summary = "Remove Staff")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveShift(Guid sfid)
	{
		var command = new RemoveStaffCommand(sfid);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}


	[HttpGet("EventsLog")]
	[SwaggerOperation(Summary = "EventsLog List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<EventsLogResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> EventsLog([FromQuery] int max, string type)
	{
		var query = new EventsLogQuery(max, type);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	
	[HttpGet("Staff/Component")]
	[SwaggerOperation(Summary = "Staff Component List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetStaffListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> StaffComponentList([FromQuery] GetStaffByComponentQuery data)
	{
		var res = await _mediator.Send(data);
		return Ok(res);
	}

	[HttpGet("Roster")]
	[SwaggerOperation(Summary = "Roster List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetRosterListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RosterList([FromQuery] GetRosterListQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpGet("Roster/Staff")]
	[SwaggerOperation(Summary = "Roster Staff List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetRosterListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RosterStaff([FromQuery] GetRosterStaffQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Roster/{roid}")]
	[SwaggerOperation(Summary = "Get Roster By Id")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetRosterResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRosterById(Guid roid)
	{
		var query = new GetRosterQuery(roid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Roster/upsert")]
	[SwaggerOperation(Summary = "Upsert Roster")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpsertRosterResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Upsert([FromBody] UpsertRosterCommand command)
	{
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpDelete("Roster/{id}")]
	[SwaggerOperation(Summary = "Remove Roster")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveRoster(Guid id)
	{
		var command = new RemoveRosterCommand(id);
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}

	[HttpGet("Summary")]
	[SwaggerOperation(Summary = "Summary Log List")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(SummaryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Summary([FromQuery] SummaryQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("SyncSummary")]
	[SwaggerOperation(Summary = "SyncSummary")]
    [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(SummaryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SyncSummary([FromQuery] SyncSummaryQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}

