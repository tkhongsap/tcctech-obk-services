using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.ChangeDefaultFloor;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.GetQueueCallLift;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.LocationMapping.GetResidenceLocationMapping;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.CheckQueueLift;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/fineday/authorizefloor")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class AuthorizeFloorController : ControllerBase
{
    private readonly IMediator _mediator;
    public AuthorizeFloorController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost("ChangeDefaultFloor")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(ChangeDefaultFloorResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ChangeDefaultFloor([FromBody] ChangeDefaultFloorCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
    [HttpPost("GetResidenceLocationMapping")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(List<GetResidenceLocationMappingResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetResidenceLocationMapping([FromBody] GetResidenceLocationMappingQuery request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("GetQueueCallLift")]
    [SwaggerOperation(Summary = "Get Queue Call Lift")]
    [ProducesResponseType(typeof(GetQueueCallLiftResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetQueueCallLift([FromBody] GetQueueCallLiftCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("CheckQueueLift")]
    [SwaggerOperation(Summary = "Check Queue Call Lift")]
    [ProducesResponseType(typeof(CheckQueueLiftResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> CheckQueueLift([FromBody] CheckQueueLiftCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
}
