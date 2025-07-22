using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;


namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;
[Route("api/v1/certis/ifm")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class IFMController : ControllerBase
{
	private readonly IMediator _mediator;
	public IFMController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("cwosbyincidentId/{id}")]
	[SwaggerOperation(Summary = "Get CWOs By Id")]
	[ProducesResponseType(typeof(List<CWOsbyincidentIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CWOsbyincidentId(int id)
	{
		var query = new CWOsbyincidentIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}