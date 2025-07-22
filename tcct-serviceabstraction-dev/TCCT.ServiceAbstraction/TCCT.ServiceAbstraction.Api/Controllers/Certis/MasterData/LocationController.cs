using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.Locations;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationTypes;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class LocationController : ControllerBase
{
	private readonly IMediator _mediator;
	public LocationController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("Locations/Types")]
	[SwaggerOperation(Summary = "Get Location Types")]
	[ProducesResponseType(typeof(List<LocationTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLocationTypes()
	{
		var query = new LocationTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Locations")]
	[SwaggerOperation(Summary = "Get Locations")]
	[ProducesResponseType(typeof(List<LocationsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLocations()
	{
		var query = new LocationsQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Location/Config")]
	[SwaggerOperation(Summary = "Get Location Default Config")]
	[ProducesResponseType(typeof(LocationConfigResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLocationConfig()
	{
		var query = new LocationConfigQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
