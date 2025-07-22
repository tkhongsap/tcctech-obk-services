using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.OnboardResidence;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.RevokeAccess;

namespace TCCT.ServiceAbstraction.Api.Controllers.Innoflex;

[Route("api/v1/innoflex")]
[ApiController]
[ApiExplorerSettings(GroupName = "innoflexv1")]

public class InnoflexController : ControllerBase
{
	private readonly IMediator _mediator;
	public InnoflexController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("attendance/log")]
	[SwaggerOperation(Summary = "Get attendance log")]
	[ProducesResponseType(typeof(AttendanceLogResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAttendanceLog([FromBody] AttendanceLogQuery body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("onboard/residence")]
	[SwaggerOperation(Summary = "Onboard Residence")]
	[ProducesResponseType(typeof(OnboardResidenceResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> OnboardResidence([FromBody] OnboardResidenceCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPost("onboard/residence/revokeAccess")]
	[SwaggerOperation(Summary = "Revoke Residence")]
	[ProducesResponseType(typeof(RevokeAccessResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RevokeAccess([FromBody] RevokeAccessCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
}
