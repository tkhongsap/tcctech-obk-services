using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWODefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOStatusCode;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOType;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;
[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class CorrectiveWorkOrderController : ControllerBase
{
	private readonly IMediator _mediator;
	public CorrectiveWorkOrderController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("CWO/types")]
	[SwaggerOperation(Summary = "Get Corrective Work Order Types")]
	[ProducesResponseType(typeof(List<CWOTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCwoType()
	{
		var query = new CWOTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpGet("CWO/statuscode")]
	[SwaggerOperation(Summary = "Get Corrective Work Order Status Code")]
	[ProducesResponseType(typeof(List<CWOStatusCodeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCwoStatusCode()
	{
		var query = new CWOStatusCodeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CWO/defaultconfig")]
	[SwaggerOperation(Summary = "Get Corrective Work Order DefaultConfig")]
	[ProducesResponseType(typeof(CWODefaultConfigResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCwoDefaultConfig()
	{
		var query = new CWODefaultConfigQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

}
