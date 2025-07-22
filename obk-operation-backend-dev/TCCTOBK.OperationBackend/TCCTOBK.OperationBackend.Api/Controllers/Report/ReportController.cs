using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Report.OperationOnboard.Query.OperationUserReport;

namespace TCCTOBK.OperationBackend.Api;

[ApiController]
[Route("api/operation/v1/report")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
public class ReportController : OperationApiControllerBase
{
	private readonly IMediator _mediator;

	public ReportController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("Attendant")]
	[SwaggerOperation(Summary = "Get Report Attendant")]
	[ProducesResponseType(typeof(GetReportAttendantResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Attendant([FromQuery] GetReportAttendantQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CheckInCheckOut")]
	[SwaggerOperation(Summary = "Get Report Check In & Check Out")]
	[ProducesResponseType(typeof(GetReportCheckInCheckOutResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckInCheckOut([FromQuery] GetReportCheckInCheckOutQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("GuardTour/TaskDetail")]
	[SwaggerOperation(Summary = "Get Report Guard Tour Each Task")]
	[ProducesResponseType(typeof(TaskDetailReportResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckInCheckOut([FromQuery] TaskDetailReportQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("OperationOnBorad/Members")]
	[SwaggerOperation(Summary = "Get Report Operation onboard members")]
	[ProducesResponseType(typeof(OperationUserReportResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> OperationOnBoradUser([FromQuery] OperationUserReportQuery query)
	{
		var res = await _mediator.Send(query);
		var date = DateTime.Now.ToString("ddMMyyyy");
		return File(res.ContentBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Members_{date}.xlsx");
	}
}
