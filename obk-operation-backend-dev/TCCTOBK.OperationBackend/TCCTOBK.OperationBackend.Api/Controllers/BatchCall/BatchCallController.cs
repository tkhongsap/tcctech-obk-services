using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.UpsertLocations;

namespace TCCTOBK.OperationBackend.Api.Controllers.BatchCall;

[ApiController]
[Route("api/v1/[controller]")]
[ApiExplorerSettings(GroupName = "batchcallv1")]
public class BatchCallController : ControllerBase
{
	private readonly IMediator _mediator;

	public BatchCallController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("UpsertLocations")]
	[SwaggerOperation(Summary = "Upsert Locations")]
	[ProducesResponseType(typeof(UpsertLocationsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	public async Task<IActionResult> UpsertLocations()
	{
		var query = new UpsertLocationsQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
