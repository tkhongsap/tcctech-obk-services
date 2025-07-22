using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.Menu.Query.GetMenu;

namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.Menu;

[Route("api/v1")]
[ApiController]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class MenuController : ControllerBase
{
	private readonly IMediator _mediator;

	public MenuController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("Menu")]
	[SwaggerOperation(Summary = "Get Menu")]
	[ProducesResponseType(typeof(GetMenuResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//TODO : Prepare data privilege  for the parq
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	public async Task<IActionResult> GetMenu([FromBody] GetMenuQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
