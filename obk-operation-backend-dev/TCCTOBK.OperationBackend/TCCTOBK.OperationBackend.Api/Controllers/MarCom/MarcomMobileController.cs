using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.ClearCache;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetContentDetail;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetWhatHappenAll;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api;

[Route("api/v1/MarcomMobile")]
[ApiController]
[ApiExplorerSettings(GroupName = "Marcomv1")]
public class MarcomMobileController : OperationApiControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public MarcomMobileController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpPost("GetContent")]
	[SwaggerOperation(Summary = "Get Marcom Content")]
	[ProducesResponseType(typeof(GetMainContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetContent(GetContent param)
	{
		GetContentQuery query = new GetContentQuery(param);
		GetMainContentResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("GetWhatHappenAll")]
	[SwaggerOperation(Summary = "Get What happening all")]
	[ProducesResponseType(typeof(WhatHappenAllResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetWhatHappenAll(GetContent param)
	{
		GetWhatHappenAllQuery query = new GetWhatHappenAllQuery(param);
		WhatHappenAllResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("GetContentDetail")]
	[SwaggerOperation(Summary = "Get Content Detail")]
	[ProducesResponseType(typeof(ContentDetailResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetContentDetail(GetContentDetail param)
	{
		GetContentDetailQuery query = new GetContentDetailQuery(param);
		ContentDetailResult result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("ClearCache")]
	[SwaggerOperation(Summary = "Clear Cache Marcom")]
	[ProducesResponseType(typeof(Application.Features.Marcom.Query.ClearCache.ResultApi), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ClearCache(GetContent param)
	{
		ClearCacheQuery query = new ClearCacheQuery(param);
		Application.Features.Marcom.Query.ClearCache.ResultApi result = await _mediator.Send(query);
		return StatusCode(result.nStatusCode, result);
	}
}