using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.PromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;

namespace TCCT.ServiceAbstraction.Api.Controllers.CarparkPayment;

[ApiController]
[Route("api/v1/carpark/payment")]
[ApiExplorerSettings(GroupName = "carparkpaymentv1")]
public class PaymentController : ControllerBase
{
	private readonly IMediator _mediator;
	public PaymentController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("PromptPay")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(PromptPayChargeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostPromptPay([FromBody] PromptPayChargeCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("TrueMoneyOnline")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(TrueMoneyOnlineChargeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostTrueMoneyOnline([FromBody] TrueMoneyOnlineChargeCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("InquiryPaymentTransaction")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(InquiryPaymentTransactionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostInquiryPaymentTransaction([FromBody] InquiryPaymentTransactionCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

}
