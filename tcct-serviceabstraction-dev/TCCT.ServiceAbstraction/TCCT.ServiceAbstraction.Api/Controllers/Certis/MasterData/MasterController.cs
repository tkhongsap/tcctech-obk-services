using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.Users;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class MasterController : ControllerBase
{
	private readonly IMediator _mediator;
	public MasterController(IMediator mediator)
	{
		_mediator = mediator;
	}
	[HttpGet("master/users")]
	[SwaggerOperation(Summary = "Get Master Users")]
	[ProducesResponseType(typeof(List<UsersResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetUsers()
	{
		var query = new UsersQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

}
