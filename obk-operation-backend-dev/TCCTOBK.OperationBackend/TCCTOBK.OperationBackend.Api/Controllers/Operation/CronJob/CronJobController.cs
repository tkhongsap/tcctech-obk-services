using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Command.UpsertPPM;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.CronJob;

[ApiController]
[Route("api/v1/cronjob/")]
[ApiExplorerSettings(GroupName = "cmsv1")]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
public class CronJobController : ControllerBase
{
	private readonly IMediator _mediator;
    public CronJobController(IMediator mediator)
    {
        _mediator = mediator;
	}

	[HttpPost("SyncPPM")]
	[SwaggerOperation(Summary = "Sync PPM")]
	[ProducesResponseType(typeof(UpsertPPMResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	public async Task<ActionResult> UpsertPPM([FromBody] UpsertPPMCommand command)
	{
		var res = await _mediator.Send(command);

		return Ok(res);
	}
}

