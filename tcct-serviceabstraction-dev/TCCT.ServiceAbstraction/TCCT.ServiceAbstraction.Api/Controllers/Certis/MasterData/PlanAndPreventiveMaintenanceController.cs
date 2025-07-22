using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.DefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.FrequencyTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.StatusCodes;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class PlanAndPreventiveMaintenanceController : ControllerBase
{
	private readonly IMediator _mediator;
	public PlanAndPreventiveMaintenanceController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("PPM/FrequencyTypes")]
	[SwaggerOperation(Summary = "Get Frequency Types")]
	[ProducesResponseType(typeof(List<FrequencyTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFrequencyTypes()
	{
		var query = new FrequencyTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/StatusCodes")]
	[SwaggerOperation(Summary = "Get Status Codes")]
	[ProducesResponseType(typeof(List<StatusCodesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetLocationTypes()
	{
		var query = new StatusCodesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/DefaultConfig")]
	[SwaggerOperation(Summary = "Get DefaultConfig")]
	[ProducesResponseType(typeof(PPMDefaultConfigResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDefaultConfig()
	{
		var query = new PPMDefaultConfigQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}

