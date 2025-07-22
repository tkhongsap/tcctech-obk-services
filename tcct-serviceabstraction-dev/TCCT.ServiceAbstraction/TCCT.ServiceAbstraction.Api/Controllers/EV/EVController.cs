using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Register;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Authorize;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SignOut;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlace;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaces;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionInit;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStart;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStop;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSession;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSessions;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionAccess;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Reserve;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserve;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserves;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCancel;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCheck;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoices;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipt;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipts;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.CheckoutInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.CancelInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReceiptRefund;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaceBuilding;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetAccount;

namespace TCCT.ServiceAbstraction.Api.Controllers.EV;

[Route("api/v1/EV")]
[ApiController]
[ApiExplorerSettings(GroupName = "evv1")]

public class EVController : ControllerBase
{
	private readonly IMediator _mediator;
	public EVController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("account/register")]
	[SwaggerOperation(Summary = "Register user")]
	[ProducesResponseType(typeof(RegisterResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Register([FromBody] RegisterCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("account/authorize")]
	[SwaggerOperation(Summary = "Authorize user")]
	[ProducesResponseType(typeof(AuthorizeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Authorize([FromBody] AuthorizeCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("account/signout")]
	[SwaggerOperation(Summary = "Sign out user")]
	[ProducesResponseType(typeof(TCCT.ServiceAbstraction.Application.Features.EV.Command.SignOut.SignOutResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SignOut([FromBody] SignOutCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("place/{uuid}")]
	[SwaggerOperation(Summary = "Get place")]
	[ProducesResponseType(typeof(PlaceResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPlace(string uuid, [FromHeader] string token)
	{
		var query = new PlaceQuery
		{
			token = token,
			uuid = uuid
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("places")]
	[SwaggerOperation(Summary = "Get all place")]
	[ProducesResponseType(typeof(PlacesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPlaces([FromHeader] string token)
	{
		var query = new PlacesQuery
		{
			token = token
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("sessionInit")]
	[SwaggerOperation(Summary = "Session Init")]
	[ProducesResponseType(typeof(SessionInitResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SessionInit([FromBody] SessionInitCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("sessionStart")]
	[SwaggerOperation(Summary = "Session Start")]
	[ProducesResponseType(typeof(SessionStartResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SessionStart([FromBody] SessionStartCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("sessionStop")]
	[SwaggerOperation(Summary = "Session Stop")]
	[ProducesResponseType(typeof(SessionStopResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SessionStop([FromBody] SessionStopCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("sessions")]
	[SwaggerOperation(Summary = "Get all sessions")]
	[ProducesResponseType(typeof(GetSessionsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSessions([FromHeader] string token, [FromQuery] int? limit = null, [FromQuery] int? page = null, [FromQuery] string? month = null)
	{
		var query = new GetSessionsQuery
		{
			token = token,
			month = month,
			pageLimit = limit,
			pageLast = page
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("session/{uuid}")]
	[SwaggerOperation(Summary = "Get session")]
	[ProducesResponseType(typeof(GetSessionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSession(string uuid, [FromHeader] string token)
	{
		var query = new GetSessionQuery
		{
			token = token,
			uuid = uuid
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}


	[HttpPost("sessionAccess")]
	[SwaggerOperation(Summary = "Session Access")]
	[ProducesResponseType(typeof(SessionAccessResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SessionAccess([FromBody] SessionAccessCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("reserve")]
	[SwaggerOperation(Summary = "Reserve")]
	[ProducesResponseType(typeof(ReserveResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Reserve([FromBody] ReserveCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("reserve/{uuid}")]
	[SwaggerOperation(Summary = "Get reserve")]
	[ProducesResponseType(typeof(GetReserveResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetReserve(string uuid, [FromHeader] string token)
	{
		var query = new GetReserveQuery
		{
			token = token,
			uuid = uuid
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("reserves")]
	[SwaggerOperation(Summary = "Get all reserves")]
	[ProducesResponseType(typeof(GetReservesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetReserves([FromHeader] string token, [FromQuery] int? limit = null, [FromQuery] int? page = null, [FromQuery] string? month = null, [FromQuery] int? status = null)
	{
		var query = new GetReservesQuery
		{
			token = token,
			month = month,
			pageLimit = limit,
			pageLast = page,
			status = status
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("reserveCancel")]
	[SwaggerOperation(Summary = "Reserve Cancel")]
	[ProducesResponseType(typeof(ReserveCancelResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ReserveCancel([FromBody] ReserveCancelCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}


	[HttpPost("reserveCheck")]
	[SwaggerOperation(Summary = "Reserve Check")]
	[ProducesResponseType(typeof(ReserveCheckResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ReserveCheck([FromBody] ReserveCheckCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("invoice/{uuid}")]
	[SwaggerOperation(Summary = "Get invoice")]
	[ProducesResponseType(typeof(GetInvoiceResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetInvoice(string uuid, [FromHeader] string token)
	{
		var query = new GetInvoiceQuery
		{
			token = token,
			uuid = uuid
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("invoices")]
	[SwaggerOperation(Summary = "Get all invoices")]
	[ProducesResponseType(typeof(GetInvoicesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetInvoices([FromHeader] string token, [FromQuery] int? limit = null, [FromQuery] int? page = null, [FromQuery] string? month = null)
	{
		var query = new GetInvoicesQuery
		{
			token = token,
			month = month,
			pageLimit = limit,
			pageLast = page
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("receipt/{uuid}")]
	[SwaggerOperation(Summary = "Get receipt")]
	[ProducesResponseType(typeof(GetReceiptResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetReceipt(string uuid, [FromHeader] string token)
	{
		var query = new GetReceiptQuery
		{
			token = token,
			uuid = uuid
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("receipts")]
	[SwaggerOperation(Summary = "Get all receipts")]
	[ProducesResponseType(typeof(GetReceiptsResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetReceipts([FromHeader] string token, [FromQuery] int? limit = null, [FromQuery] int? page = null, [FromQuery] string? month = null)
	{
		var query = new GetReceiptsQuery
		{
			token = token,
			month = month,
			pageLimit = limit,
			pageLast = page
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("checkoutInvoice")]
	[SwaggerOperation(Summary = "Checkout Invoice")]
	[ProducesResponseType(typeof(CheckoutInvoiceResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckoutInvoice([FromBody] CheckoutInvoiceCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("cancelInvoice")]
	[SwaggerOperation(Summary = "Cancel Invoice")]
	[ProducesResponseType(typeof(CancelInvoiceResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CancelInvoice([FromBody] CancelInvoiceCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("receiptRefund")]
	[SwaggerOperation(Summary = "Receipt Refund")]
	[ProducesResponseType(typeof(ReceiptRefundResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ReceiptRefund([FromBody] ReceiptRefundCommand body, [FromHeader] string token)
	{
		body.token = token;
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("place/{place}/building/{building}")]
	[SwaggerOperation(Summary = "Get place building")]
	[ProducesResponseType(typeof(PlaceBuildingResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPlaceBuilding(string place, string building, [FromHeader] string token, [FromQuery] string? date = null)
	{
		var query = new PlaceBuildingQuery
		{
			token = token,
			place = place,
			building = building,
			date = date
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("account/me")]
	[SwaggerOperation(Summary = "Get account")]
	[ProducesResponseType(typeof(GetAccountResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAccount([FromHeader] string token)
	{
		var query = new GetAccountQuery
		{
			token = token
		};
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
