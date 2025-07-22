using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataRateCodeListByTenantID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.RedeemParking;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataDepartment;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataMemberType;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataTerminal;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataVehicleType;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.CheckRedemptionStatusByEmail;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/fineday/redemtion")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class RedemptionController : ControllerBase
{
    private readonly IMediator _mediator;
    public RedemptionController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost("RedeemParking")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(RedeemParkingResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> RedeemParking([FromBody] RedeemParkingCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
    [HttpPost("GetRateCodeListByTenantID")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetDataRateCodeListByTenantIDResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetRateCodeListByTenantID(GetDataRateCodeListByTenantIDQuery request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpGet("GetDataDepartment")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetDataDepartmentResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetDataDepartment()
    {
        var request = new GetDataDepartmentQuery();
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpGet("GetDataMemberType")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetDataMemberTypeResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetDataMemberType()
    {
        var request = new GetDataMemberTypeQuery();
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpGet("GetDataTerminal")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetDataTerminalResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetDataTerminal()
    {
        var request = new GetDataTerminalQuery();
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpGet("GetDataVehicleType")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetDataVehicleTypeResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetDataVehicleType()
    {
        var request = new GetDataVehicleTypeQuery();
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("CheckRedemptionStatusByEmail")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(CheckRedemptionStatusByEmailResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> CheckRedemptionStatusByEmail(CheckRedemptionStatusByEmailCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
}