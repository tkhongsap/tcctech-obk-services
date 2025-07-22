using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GenerateReceipt;

namespace TCCT.ServiceAbstraction.Api.Controllers.CarparkPayment;

[ApiController]
[Route("api/v1/carpark/redemption")]
[ApiExplorerSettings(GroupName = "carparkpaymentv1")]
public class RedemptionController : ControllerBase
{
	private readonly IMediator _mediator;
	public RedemptionController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("GetParkingDetail")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetParkingDetailResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetParkingDetail([FromBody] GetParkingDetailQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("AlldataDetailsReceipt")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(AlldataDetailsReceiptResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostAlldataDetailsReceipt([FromBody] AlldataDetailsReceiptCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("GenerateReceipt")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GenerateReceiptResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GenerateReceipt([FromBody] GenerateReceiptCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

}
