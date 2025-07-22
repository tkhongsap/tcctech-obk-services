using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.AttachmentTypes;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class AttachmentTypeController : ControllerBase
{
	private readonly IMediator _mediator;
	public AttachmentTypeController(IMediator mediator)
	{
		_mediator = mediator;
	}
	[HttpGet("AttachmentTypes")]
	[SwaggerOperation(Summary = "Get Attachment Types")]
	[ProducesResponseType(typeof(List<AttachmentTypeResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAssetCategories()
	{
		var query = new AttachmentTypeQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

}
