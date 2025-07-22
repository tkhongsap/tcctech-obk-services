using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CompleteTaskCaseIncident;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CreateCaseIncident;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.UpdateTaskCaseIncident;

namespace TCCTOBK.OperationBackend.Api;
[ApiController]
[Route("api/v1/operation/mobile/SOC")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
[MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
public class SOCController : OperationApiControllerBase
{
	private readonly IMediator _mediator;

	public SOCController(IMediator mediator)
	{
		_mediator = mediator;
	}

	//[HttpGet("")]
	//[SwaggerOperation(Summary = "Get List SOC")]
	//[ProducesResponseType(typeof(SOCListResult), (int)HttpStatusCode.OK)]
	//[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	//[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//public async Task<IActionResult> SOCIncident()
	//{
	//  var query = new SOCListQuery();
	//  var res = await _mediator.Send(query);
	//  return Ok(res);
	//}

	//[HttpPost("")]
	//[SwaggerOperation(Summary = "Create List SOC")]
	//[ProducesResponseType(typeof(CreateSOCResult), (int)HttpStatusCode.OK)]
	//[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	//[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//public async Task<IActionResult> CreateIncident([FromBody] CreateSOCCommand data)
	//{
	//  var res = await _mediator.Send(data);
	//  return Ok(res);
	//}

	//[HttpGet("Detail")]
	//[SwaggerOperation(Summary = "Detail List SOC")]
	//[ProducesResponseType(typeof(SOCDetailResult), (int)HttpStatusCode.OK)]
	//[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	//[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//public async Task<IActionResult> DetailIncident([FromQuery] int id)
	//{
	//  var query = new SOCDetailQuery(id);
	//  var res = await _mediator.Send(query);
	//  return Ok(res);
	//}

	[HttpGet("CaseIncidentList")]
	[SwaggerOperation(Summary = "CaseIncidentList")]
	[ProducesResponseType(typeof(CaseIncidentListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CaseIncidentList()
	{
		var query = new CaseIncidentListQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CaseIncidentDetail/{id}")]
	[SwaggerOperation(Summary = "CaseIncidentDetail")]
	[ProducesResponseType(typeof(CaseIncidentDetailResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CaseIncidentDetail(int id)
	{
		var query = new CaseIncidentDetailQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpPost("CreateCaseIncident")]
	[SwaggerOperation(Summary = "Create Case Incident")]
	[ProducesResponseType(typeof(CreateCaseIncidentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]

	public async Task<IActionResult> CreateCaseIncident([FromBody] CreateCaseIncidentCommand data)
	{
		var res = await _mediator.Send(data);
		return Ok(res);
	}

	[HttpGet("CaseIncident/{caseId}/Tasks")]
	[SwaggerOperation(Summary = "CaseIncidentDetail")]
	[ProducesResponseType(typeof(CaseIncidentDetailResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CaseIncidentTasks(int caseId)
	{
		var query = new CaseIncidentTasksQuery(caseId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("CompleteTaskCaseIncident")]
	[SwaggerOperation(Summary = "Complete Task Case Incident")]
	[ProducesResponseType(typeof(CompleteTaskCaseIncidentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CompleteTaskCaseIncident([FromBody] CompleteTaskCaseIncidentCommand data)
	{
		var res = await _mediator.Send(data);
		return Ok(res);
	}

	[HttpPost("UpdateTaskCaseIncident")]
	[SwaggerOperation(Summary = "Update Task Case Incident")]
	[ProducesResponseType(typeof(UpdateTaskCaseIncidentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateTaskCaseIncident([FromBody] UpdateTaskCaseIncidentCommand data)
	{
		var res = await _mediator.Send(data);
		return Ok(res);
	}
}
