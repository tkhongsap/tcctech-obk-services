using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Tenant.GetDataTenant;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayIviva;

[ApiController]
[Route("api/v1/fineday/iviva/tenant")]
[ApiExplorerSettings(GroupName = "finedayivivav1")]
public class TenantController : ControllerBase
{
	private readonly IMediator _mediator;
	public TenantController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("GetDataTenant")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(GetDataTenantResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostGetDataTenant([FromBody] GetDataTenantQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

}
