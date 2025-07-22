using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetCardsAccessGroups;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.CancelCardResidenceByCardNumber;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetDataResidenceCardByPersonId;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/fineday/card")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class CardController : ControllerBase
{
    private readonly IMediator _mediator;
    public CardController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet("GetCardsAccessGroups")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetCardsAccessGroupsResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetCardsAccessGroups()
    {
        var request = new GetCardsAccessGroupsQuery();
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("CancelCardResidenceByCardNumber")]
	[SwaggerOperation(Summary = "Cancel Card Residence By Card Number")]
	[ProducesResponseType(typeof(CancelCardResidenceByCardNumberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CancelCardResidenceByCardNumber([FromBody] CancelCardResidenceByCardNumberCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

    [HttpPost("GetDataResidenceCardByPersonId")]
	[SwaggerOperation(Summary = "Get Data Residence Card By Person Id")]
	[ProducesResponseType(typeof(List<GetDataResidenceCardByPersonIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDataResidenceCardByPersonId([FromBody] GetDataResidenceCardByPersonIdCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
}
