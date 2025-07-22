using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;

namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.HomeContent;

[Route("api/v1/AppConfig")]
[ApiController]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class AppConfigController : ControllerBase
{
	private readonly IMediator _mediator;
	public AppConfigController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("{name}")]
	[SwaggerOperation(Summary = "Get RemoteConfig Data")]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Get(string name)
	{
		var query = new GetAppConfigByNameQuery(name);
		var result = await _mediator.Send(query);
		return Ok(result);
	}
}
