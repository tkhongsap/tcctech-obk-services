using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetail;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByQRCode;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByPersonId;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/fineday/carpark")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class CarparkController : ControllerBase
{
    private readonly IMediator _mediator;
    public CarparkController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost("GetParkingDetailByQRCode")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetParkingDetailByQRCodeResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetParkingDetailByQRCode([FromBody] GetParkingDetailByQRCodeQuery request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
    [HttpPost("GetParkingDetail")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetParkingDetailResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetParkingDetail([FromBody] GetParkingDetailQuery request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("GetParkingDetailByPersonId")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetParkingDetailByPersonIdResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetParkingDetailByPersonId([FromBody] GetParkingDetailByPersonIdQuery request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
}
