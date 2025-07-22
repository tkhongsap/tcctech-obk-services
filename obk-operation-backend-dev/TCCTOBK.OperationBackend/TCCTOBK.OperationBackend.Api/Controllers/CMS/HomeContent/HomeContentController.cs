using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Command.UploadHomeContent;
using TCCTOBK.OperationBackend.Application.GetCurrentVersion;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.HomeContent;
[Route("api/v1/HomeContent")]
[ApiController]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class HomeContentController : ControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public HomeContentController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpGet("RemoteConfig")]
	[SwaggerOperation(Summary = "Get RemoteConfig Data")]
	[ProducesResponseType(typeof(GetRemoteConfigDataResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRemoteConfig()
	{
		var query = new GetRemoteConfigDataQuery();
		await _mediator.Send(query);
		return Ok();
	}
	[HttpGet("Versions")]
	[SwaggerOperation(Summary = "Get List Version Home Content")]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAllVersion([FromQuery] GetVersionsQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Version/{id}")]
	[SwaggerOperation(Summary = "Get Version Home Content")]
	[ProducesResponseType(typeof(GetVersionsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetVersion(Guid id)
	{
		var query = new GetVersionQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Upload")]
	[SwaggerOperation(Summary = "Upload Images Homecontent")]
	[ProducesResponseType(typeof(UploadHomeContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Upload(UploadHomeContentCommand command)
	{
		var result = await _mediator.Send(command);
		return Ok(result);
	}

	[HttpPost("Publish")]
	[SwaggerOperation(Summary = "Publish Homecontent")]
	[ProducesResponseType(typeof(UpdateHomeContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Publish(UpdateHomeContentCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var result = await _mediator.Send(command);
		return Ok(result);
	}

	[HttpGet("LatestVersion")]
	[SwaggerOperation(Summary = "GetLasted Homecontent")]
	[ProducesResponseType(typeof(UpdateHomeContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLastedVersion()
	{
		var query = new GetCurrentVersionQuery();
		var result = await _mediator.Send(query);
		return Ok(result);
	}
}
