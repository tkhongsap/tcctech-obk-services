using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists.CheckListTasks;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CommentTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors.FMSupervisorServices;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians.FMTechnicianServices;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Priorities;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ProblemTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Requesters;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.RequesterTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceCategories.ServingLocations;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceProviders;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class FMRelatedController : ControllerBase
{
	private readonly IMediator _mediator;
	public FMRelatedController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("FMRelated/Priorities")]
	[SwaggerOperation(Summary = "Get Priorities")]
	[ProducesResponseType(typeof(List<PriorityResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPriorities()
	{
		var query = new PriorityQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpGet("FMRelated/Requesters/Types")]
	[SwaggerOperation(Summary = "Get Requester Types")]
	[ProducesResponseType(typeof(List<RequesterTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRequesterTypes()
	{
		var query = new RequesterTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/Requesters")]
	[SwaggerOperation(Summary = "Get Requesters")]
	[ProducesResponseType(typeof(List<RequesterResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRequesters()
	{
		var query = new RequesterQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/CommentTypes")]
	[SwaggerOperation(Summary = "Get Comment Types")]
	[ProducesResponseType(typeof(List<CommentTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCommentTypes()
	{
		var query = new CommentTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/ServiceProviders")]
	[SwaggerOperation(Summary = "Get Service Providers")]
	[ProducesResponseType(typeof(List<ServiceProviderResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetServiceProviders()
	{
		var query = new ServiceProviderQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/ServiceCategories")]
	[SwaggerOperation(Summary = "Get Service Categories")]
	[ProducesResponseType(typeof(List<ServiceCategoryResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetServiceCategories()
	{
		var query = new ServiceCategoryQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/ServiceCategories/ServingLocations")]
	[SwaggerOperation(Summary = "Get Serving Locations")]
	[ProducesResponseType(typeof(List<ServingLocationResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetServingLocations()
	{
		var query = new ServingLocationQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/ProblemTypes")]
	[SwaggerOperation(Summary = "Get Problem Types")]
	[ProducesResponseType(typeof(List<ProblemTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetProblemTypes()
	{
		var query = new ProblemTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/Checklists")]
	[SwaggerOperation(Summary = "Get Checklists")]
	[ProducesResponseType(typeof(List<CheckListResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetChecklists()
	{
		var query = new CheckListQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/Checklists/Tasks")]
	[SwaggerOperation(Summary = "Get Checklist Tasks")]
	[ProducesResponseType(typeof(List<CheckListTaskResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetChecklistTasks()
	{
		var query = new CheckListTaskQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/FMSupervisors")]
	[SwaggerOperation(Summary = "Get FMSupervisors")]
	[ProducesResponseType(typeof(List<FMSupervisorResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFMSupervisors()
	{
		var query = new FMSupervisorQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/FMSupervisors/Services")]
	[SwaggerOperation(Summary = "Get FMSupervisor Services")]
	[ProducesResponseType(typeof(List<FMSupervisorServiceResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFMSupervisorServices()
	{
		var query = new FMSupervisorServiceQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/FMTechnicians")]
	[SwaggerOperation(Summary = "Get FMTechnicians")]
	[ProducesResponseType(typeof(List<FMTechnicianResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFMTechnicians()
	{
		var query = new FMTechnicianQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("FMRelated/FMTechnicians/Services")]
	[SwaggerOperation(Summary = "Get FMTechnician Services")]
	[ProducesResponseType(typeof(List<FMTechnicianServiceResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFMTechnicianServices()
	{
		var query = new FMTechnicianServiceQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
