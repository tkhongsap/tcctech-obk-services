using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;

namespace TCCT.ServiceAbstraction.Api.Controllers.Payment;

[ApiController]
[Route("api/v1/payment")]
[ApiExplorerSettings(GroupName = "paymentv1")]
public class PaymentV2Controller : ControllerBase
{
	private readonly IMediator _mediator;
	public PaymentV2Controller(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("PromptPay")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(ArgentoPromptPayChargeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ArgentoPromptPay([FromBody] ArgentoPromptPayChargeCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("Inquiry")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(ArgentoInquiryPaymentTransactionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ArgentoInquiryPaymentTransaction([FromBody] ArgentoInquiryPaymentTransactionCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

}
