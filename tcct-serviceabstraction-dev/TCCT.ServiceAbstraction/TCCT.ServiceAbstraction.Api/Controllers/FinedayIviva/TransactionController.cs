using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionCarpark;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionTurnstile;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionVisitor;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayIviva;

[ApiController]
[Route("api/v1/fineday/iviva/transaction")]
[ApiExplorerSettings(GroupName = "finedayivivav1")]
public class TransactionController : ControllerBase
{
	private readonly IMediator _mediator;
	public TransactionController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("GetDataTransactionCarpark")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataTransactionCarparkResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataTransactionCarpark([FromBody] GetDataTransactionCarparkQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
	[HttpPost("GetDataTransactionMember")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataTransactionMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataTransactionMember([FromBody] GetDataTransactionMemberQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
	[HttpPost("GetDataTransactionVisitor")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataTransactionVisitorResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataTransactionVisitor([FromBody] GetDataTransactionVisitorQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
	[HttpPost("GetDataTransactionTurnstile")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataTransactionTurnstileResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataTransactionTurnstile([FromBody] GetDataTransactionTurnstileQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

}
