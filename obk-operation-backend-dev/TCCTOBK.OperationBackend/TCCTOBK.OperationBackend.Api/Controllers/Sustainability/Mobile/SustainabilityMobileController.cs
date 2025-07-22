using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryCategory;
using TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryFile;
using TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContent;
using TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContentDetail;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api;

[Route("api/v1/SustainabilityMobile")]
[ApiController]
[ApiExplorerSettings(GroupName = "sustainabilityv1")]
public class SustainabilityMobileController : OperationApiControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public SustainabilityMobileController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpPost("GetContent")]
	[SwaggerOperation(Summary = "Get Sustainability Content")]
	[ProducesResponseType(typeof(GetMainContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetContent(GetContent param)
	{
		GetContentQuery query = new GetContentQuery(param);
		GetMainContentResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("GetContentDetail")]
	[SwaggerOperation(Summary = "Get Sustainability Content Detail")]
	[ProducesResponseType(typeof(GetContentDetailQuery), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetContentDetail(GetContentDetail param)
	{
		GetContentDetailQuery query = new GetContentDetailQuery(param);
		GetContentDetailResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("GetDigitalLibraryCategory")]
	[SwaggerOperation(Summary = "Get Digital Library Category")]
	[ProducesResponseType(typeof(GetDigitalCategoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDigitalLibraryCategory(GetContent param)
	{
		GetDigitalLibraryCategoryQuery query = new GetDigitalLibraryCategoryQuery(param);
		GetDigitalCategoryResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("GetDigitalLibraryFile")]
	[SwaggerOperation(Summary = "Get Digital Library File")]
	[ProducesResponseType(typeof(GetDigitalCategoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDigitalLibraryFile(GetContentDetail param)
	{
		GetDigitalLibraryFileQuery query = new GetDigitalLibraryFileQuery(param);
		GetDigitalFileResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}
}