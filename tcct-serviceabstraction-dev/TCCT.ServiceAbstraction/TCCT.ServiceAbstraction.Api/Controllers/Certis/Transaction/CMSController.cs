using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Assets;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseAssetCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocations;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocationTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseMedia;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.Cases;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseStatus;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseTasks;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseTaskByTaskId;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventSubTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Icons;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Media.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Priorities;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.SiteHandlers;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.SlaConfigs;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskStatuses;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.UpdateCaseStatus;

namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;
[Route("api/v1/certis/cms/cases")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class CMSController : ControllerBase
{
	private readonly IMediator _mediator;
	public CMSController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost()]
	[SwaggerOperation(Summary = "Create Cases")]
	[ProducesResponseType(typeof(CasesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostCases([FromBody] CasesRequest body)
	{
		var command = new CasesCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("event/types")]
	[SwaggerOperation(Summary = "Get Event Type")]
	[ProducesResponseType(typeof(List<EventTypesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetEventType()
	{
		var query = new EventTypesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("event/subtypes")]
	[SwaggerOperation(Summary = "Get Event SubTypes")]
	[ProducesResponseType(typeof(List<EventSubTypesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetEventSubTypes()
	{
		var query = new EventSubTypesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("event/categories")]
	[SwaggerOperation(Summary = "Get Event Categories")]
	[ProducesResponseType(typeof(List<EventCategoriesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetEventCategories()
	{
		var query = new EventCategoriesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("types")]
	[SwaggerOperation(Summary = "Get Case Types")]
	[ProducesResponseType(typeof(List<CaseTypesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCasesTypes()
	{
		var query = new CaseTypesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("status")]
	[SwaggerOperation(Summary = "Get Case Status")]
	[ProducesResponseType(typeof(List<CaseStatusResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCasesStatus()
	{
		var query = new CaseStatusQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("task/category")]
	[SwaggerOperation(Summary = "Get Case Status")]
	[ProducesResponseType(typeof(List<TaskCategoryResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTaskCategory()
	{
		var query = new TaskCategoryQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	
	[HttpGet("task/status")]
	[SwaggerOperation(Summary = "Get Task Status")]
	[ProducesResponseType(typeof(List<TaskStatusesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTaskStatuses()
	{
		var query = new TaskStatusesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	
	[HttpGet("sitehandlers")]
	[SwaggerOperation(Summary = "Get SiteHandlers")]
	[ProducesResponseType(typeof(List<SiteHandlersResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSiteHandlers()
	{
		var query = new SiteHandlersQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("priority")]
	[SwaggerOperation(Summary = "Get Case Priority")]
	[ProducesResponseType(typeof(List<PriorityLevelResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCasePriorities()
	{
		var query = new PriorityLevelQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("slaconfigs")]
	[SwaggerOperation(Summary = "Get SlaConfigs")]
	[ProducesResponseType(typeof(List<SlaConfigsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSlaConfigs()
	{
		var query = new SlaConfigsQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("locations")]
	[SwaggerOperation(Summary = "Get Case Locations")]
	[ProducesResponseType(typeof(List<CaseLocationsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseLocations()
	{
		var query = new CaseLocationsQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("locations/types")]
	[SwaggerOperation(Summary = "Get Case Location Types")]
	[ProducesResponseType(typeof(List<CaseLocationTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseLocationTypes()
	{
		var query = new CaseLocationTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("assets")]
	[SwaggerOperation(Summary = "Get Case Assets")]
	[ProducesResponseType(typeof(List<CaseAssetResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAssets()
	{
		var query = new CaseAssetQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	
	[HttpGet("assets/categories")]
	[SwaggerOperation(Summary = "Get Case Asset Categories")]
	[ProducesResponseType(typeof(List<CaseAssetCategoriesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseAssetCategories()
	{
		var query = new CaseAssetCategoriesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("icons")]
	[SwaggerOperation(Summary = "Get Case Icons")]
	[ProducesResponseType(typeof(List<IconResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetIcons()
	{
		var query = new IconQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("{caseId}/tasks")]
	[SwaggerOperation(Summary = "Get Case task")]
	[ProducesResponseType(typeof(List<CaseTaskResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseTaskByCaseId(int caseId)
	{
		var query = new CaseTaskQuery(caseId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("{caseId}/media")]
	[SwaggerOperation(Summary = "Get Case media")]
	[ProducesResponseType(typeof(List<CaseMediaResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseMediaByCaseId(int caseId)
	{
		var query = new CaseMediaQuery(caseId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Cases/{id}")]
	[SwaggerOperation(Summary = "Get Documents Related By Id")]
	[ProducesResponseType(typeof(GetCaseByIdResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseById(int id)
	{
		var query = new GetCaseByIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	
	[HttpGet("{caseid}/tasks/{taskid}")]
	[SwaggerOperation(Summary = "Get Documents Related By Id")]
	[ProducesResponseType(typeof(GetCaseTaskByTaskIdResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCaseTaskByTaskId(int caseid, int taskid)
	{
		var query = new GetCaseTaskByTaskIdQuery(caseid, taskid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("task")]
	[SwaggerOperation(Summary = "Create Task in caseid")]
	[ProducesResponseType(typeof(CaseCreateTaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostCaseCreateTasks([FromBody] CaseCreateTaskRequest body)
	{
		var command = new CaseCreateTaskCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}
	[HttpPost("media")]
	[SwaggerOperation(Summary = "Create Task in caseid")]
	[ProducesResponseType(typeof(CaseCreateTaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateMedia([FromForm] CreateMediaCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
	[HttpPatch("task")]
	[SwaggerOperation(Summary = "Update Task by taskId")]
	[ProducesResponseType(typeof(CaseUpdateTaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateTaskByTaskId([FromBody] CaseUpdateTaskCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
	[HttpGet("")]
	[SwaggerOperation(Summary = "Get Cases List")]
	[ProducesResponseType(typeof(List<CaseResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCases()
	{
		var query = new CaseQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("updates")]
	[SwaggerOperation(Summary = "Get Cases Updates List")]
	[ProducesResponseType(typeof(List<CasesUpdatesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCasesUpdates([FromQuery] CasesUpdatesQuery? query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("interface/{caseId}/cwo")]
	[SwaggerOperation(Summary = "Create CWO with Case Link")]
	[ProducesResponseType(typeof(CreateCWOWithCaseLinkResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateCWOWithCaseLink(string caseId)
	{
		var body = new CreateCWOWithCaseLinkCommand(caseId);
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPut("update-case-status")]
	[SwaggerOperation(Summary = "Update Case Status")]
	[ProducesResponseType(typeof(UpdateCaseStatusResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateCaseStatus([FromBody] UpdateCaseStatusCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
}