using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Common.Query.GetImage;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.Common;

[ApiController]
[Route("api/v1/common/")]
[ApiExplorerSettings(GroupName = "cmsv1")]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
public class CronJobController : ControllerBase
{
	private readonly IMediator _mediator;
    public CronJobController(IMediator mediator)
    {
        _mediator = mediator;
	}

	[HttpGet("GetImageData")]
	[SwaggerOperation(Summary = "Get Image From MinIO")]
	[ProducesResponseType(typeof(List<GetImageResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	public async Task<ActionResult> GetImageData([FromQuery] GetImageQuery command)
	{
		var res = await _mediator.Send(command);

		return Ok(res);
	}
}

