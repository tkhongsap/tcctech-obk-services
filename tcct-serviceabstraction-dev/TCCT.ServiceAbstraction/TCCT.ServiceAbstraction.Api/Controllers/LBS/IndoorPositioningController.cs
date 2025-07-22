using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.LogPose.QueryPosition;
using TCCT.ServiceAbstraction.Application.Features.LogPose.SaveSensing;

namespace TCCT.ServiceAbstraction.Api.Controllers.LBS;

[ApiController]
[Route("api/v1/lbs/position")]
[ApiExplorerSettings(GroupName = "lbsv1")]
public class IndoorPositioningController : ControllerBase
{
	private readonly IMediator _mediator;
	public IndoorPositioningController(IMediator mediator)
	{
		_mediator = mediator;
	}

	//[HttpGet("AP")]
	//[SwaggerOperation(Summary = "")]
	//[ProducesResponseType(typeof(List<GetAPResponse>), (int)HttpStatusCode.OK)]
	//[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	//[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//public async Task<IActionResult> GetAP()
	//{
	//	var query = new GetAPQuery();
	//	var res = await _mediator.Send(query);
	//	return Ok(res);
	//}


	[HttpPost("sensing")]
	[SwaggerOperation(Summary = "รวบรวมข้อมูลที่ได้จาก sensor ของ mobile เพื่อเอาไปทำ machine learning ต่อ")]
	[ProducesResponseType(typeof(SaveSensingResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostSensing([FromBody] SaveSensingCommand request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}

	[HttpPost("query")]
	[SwaggerOperation(Summary = "ส่งข้อมูล sensing มาแล้วตอบกลับไปว่าอยู่ที่ไหน")]
	[ProducesResponseType(typeof(QueryPositionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostQuery([FromBody] QueryPositionQuery request)
	{
		var res = await _mediator.Send(request);
		return Ok(res);
	}


}
