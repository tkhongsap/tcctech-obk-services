//using MediatR;
//using Microsoft.AspNetCore.Mvc;
//using Swashbuckle.AspNetCore.Annotations;
//using System.Net;
//using TCCT.ServiceAbstraction.Application.Features;
//using TCCT.ServiceAbstraction.Application.Features.Firebase.SendEmail;

//namespace TCCT.ServiceAbstraction.Api.Controllers.Facility.Management;

//[ApiController]
//[Route("api/v1/Notification")]
//public class NotificationController : ControllerBase
//{
//	private readonly IMediator _mediator;
//	public NotificationController(IMediator mediator)
//	{
//		_mediator = mediator;
//	}

//	[HttpPost]
//	[Route("Email")]
//	[SwaggerOperation(Summary = "ใช้ส่ง email หา user", Description = "")]
//	[ProducesResponseType(typeof(SendEmailResult), (int)HttpStatusCode.OK)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//	public async Task<IActionResult> PostEmail(string fromemail, string toemail, string message)
//	{
//		var ishtml = true;
//		var command = new SendEmailCommand(fromemail, toemail, message, ishtml);
//		var res = await _mediator.Send(command);
//		return Ok(res);
//	}



//}
