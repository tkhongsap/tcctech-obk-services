using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;

namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;
[Route("api/v1/certis/cms/wfm")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class WFMController : ControllerBase
{
	private readonly IMediator _mediator;
	public WFMController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("staff/clockin")]
	[SwaggerOperation(Summary = "Staff Clock In")]
	[ProducesResponseType(typeof(StaffClockInResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> StaffClockIn([FromBody] StaffClockInCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("staff/clockout")]
	[SwaggerOperation(Summary = "Staff Clock Out")]
	[ProducesResponseType(typeof(StaffClockOutResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> StaffClockOut([FromBody] StaffClockOutCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("dutyshifts/schedules")]
	[SwaggerOperation(Summary = "Duty Shifts Schedules")]
	[ProducesResponseType(typeof(List<DutyShiftsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DutyShifts([FromQuery] DutyShiftsQuery body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
}