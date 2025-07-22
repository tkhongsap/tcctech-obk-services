using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidence;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidenceMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckFrontalFaceImage;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.UpdateResidenceMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckStatusMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDetailResidenceMemberByPersonID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.InactiveResidenceByResidenceID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceAuthorizeFloorMaster;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetMasServiceType;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/fineday/residence")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class ResidenceController : ControllerBase
{
	private readonly IMediator _mediator;
	public ResidenceController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("AddResidence")]
	[SwaggerOperation(Summary = "Add Residence")]
	[ProducesResponseType(typeof(AddResidenceResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AddResidence([FromBody] AddResidenceCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("AddResidenceMember")]
	[SwaggerOperation(Summary = "Add Residence Member")]
	[ProducesResponseType(typeof(AddResidenceMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AddResidenceMember([FromBody] AddResidenceMemberCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("CheckFrontalFaceImage")]
	[SwaggerOperation(Summary = "Check Frontal Face Image")]
	[ProducesResponseType(typeof(CheckFrontalFaceImageResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckFrontalFaceImage([FromBody] CheckFrontalFaceImageCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("UpdateResidenceMember")]
	[SwaggerOperation(Summary = "Update Residence Member")]
	[ProducesResponseType(typeof(UpdateResidenceMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateResidenceMember([FromBody] UpdateResidenceMemberCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("GetDataResidenceMember")]
	[SwaggerOperation(Summary = "Get Data Residence Member")]
	[ProducesResponseType(typeof(GetDataResidenceMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDataResidenceMember([FromBody] GetDataResidenceMemberCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	
	[HttpPost("CheckStatusMember")]
	[SwaggerOperation(Summary = "Check Status Member")]
	[ProducesResponseType(typeof(CheckStatusMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckStatusMember([FromBody] CheckStatusMemberCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("GetDetailResidenceMemberByPersonID")]
	[SwaggerOperation(Summary = "Get Detail Residence Member By Person ID")]
	[ProducesResponseType(typeof(GetDetailResidenceMemberByPersonIDResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDetailResidenceMemberByPersonID([FromBody] GetDetailResidenceMemberByPersonIDCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("InactiveResidenceByResidenceID")]
	[SwaggerOperation(Summary = "Inactive Residence By Residence ID")]
	[ProducesResponseType(typeof(InactiveResidenceByResidenceIDResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> InactiveResidenceByResidenceID([FromBody] InactiveResidenceByResidenceIDCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("GetDataResidenceAuthorizeFloorMaster")]
	[SwaggerOperation(Summary = "Get Data Residence Authorize Floor Master")]
	[ProducesResponseType(typeof(GetDataResidenceAuthorizeFloorMasterResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDataResidenceAuthorizeFloorMaster([FromBody] GetDataResidenceAuthorizeFloorMasterCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpGet("GetMasServiceType")]
    [SwaggerOperation(Summary = "")]
    [ProducesResponseType(typeof(GetMasServiceTypeResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetMasServiceType()
    {
		var request = new GetMasServiceTypeQuery();
        var res = await _mediator.Send(request);
        return Ok(res);
    }
}
