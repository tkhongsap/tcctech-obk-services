using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.Invite;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.GetDataInviteVisitorTransaction;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.SetApproveInviteResidenceVisitor;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;
[ApiController]
[Route("api/v1/fineday/preregister")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class PreRegisterController : ControllerBase
{
    private readonly IMediator _mediator;
    public PreRegisterController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost("InviteResidenceVisitor")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(InviteResidenceVisitorResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> InviteResidenceVisitor([FromBody] InviteResidenceVisitorCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
    [HttpPost("CancelInviteResidenceVisitor")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(CancelInviteResidenceVisitorResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> CancelInviteResidenceVisitor([FromBody] CancelInviteResidenceVisitorCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
    [HttpPost("GetDataInviteVisitorTransaction")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetDataInviteVisitorTransactionResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetDataInviteVisitorTransaction([FromBody] GetDataInviteVisitorTransactionQuery request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("SetApproveInviteResidenceVisitor")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(SetApproveInviteResidenceVisitorResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> SetApproveInviteResidenceVisitor([FromBody] SetApproveInviteResidenceVisitorCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("CheckPreRegisterIsPass")]
	[SwaggerOperation(Summary = "checkPreRegisterIsPass")]
	[ProducesResponseType(typeof(CheckPreRegisterIsPassResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckPreRegisterIsPass([FromBody] CheckPreRegisterIsPassCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}
}
