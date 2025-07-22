using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMemberCarPark;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayIviva;

[ApiController]
[Route("api/v1/fineday/iviva/member")]
[ApiExplorerSettings(GroupName = "finedayivivav1")]
public class MemberController : ControllerBase
{
	private readonly IMediator _mediator;
	public MemberController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("GetDataMember")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataMember([FromBody] GetDataMemberQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
	[HttpPost("GetDataMemberCarPark")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataMemberCarParkResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataMemberCarPark([FromBody] GetDataMemberCarParkQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

}
