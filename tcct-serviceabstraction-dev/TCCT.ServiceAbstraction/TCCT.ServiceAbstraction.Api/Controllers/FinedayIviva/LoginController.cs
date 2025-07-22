//using MediatR;
//using Microsoft.AspNetCore.Mvc;
//using Swashbuckle.AspNetCore.Annotations;
//using System.Net;
//using TCCT.ServiceAbstraction.Application.Features;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.CheckToken;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.ForceLogout;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Logout;
//using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.TestConnection;

//namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayIviva;

//[ApiController]
//[Route("api/v1/fineday/iviva/login")]
//[ApiExplorerSettings(GroupName = "finedayivivav1")]
//public class LoginController : ControllerBase
//{
//	private readonly IMediator _mediator;
//	public LoginController(IMediator mediator)
//	{
//		_mediator = mediator;
//	}

//	[HttpPost("login")]
//	[SwaggerOperation(Summary = "")]
//	[ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
//	public async Task<IActionResult> PostLogin([FromBody] LoginCommand request)
//	{
//		var res = await _mediator.Send(request);
//		return Ok(res);
//	}
//	[HttpPost("logout")]
//	[SwaggerOperation(Summary = "")]
//	[ProducesResponseType(typeof(LogoutResult), (int)HttpStatusCode.OK)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
//	public async Task<IActionResult> PostLogout([FromBody] LogoutCommand request)
//	{
//		var res = await _mediator.Send(request);
//		return Ok(res);
//	}
//	[HttpPost("checktoken")]
//	[SwaggerOperation(Summary = "")]
//	[ProducesResponseType(typeof(LogoutResult), (int)HttpStatusCode.OK)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
//	public async Task<IActionResult> PostCheckToken([FromBody] CheckTokenCommand request)
//	{
//		var res = await _mediator.Send(request);
//		return Ok(res);
//	}
//	[HttpPost("forcelogout")]
//	[SwaggerOperation(Summary = "")]
//	[ProducesResponseType(typeof(LogoutResult), (int)HttpStatusCode.OK)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
//	public async Task<IActionResult> PostForceLogout([FromBody] ForceLogoutCommand request)
//	{
//		var res = await _mediator.Send(request);
//		return Ok(res);
//	}
//	[HttpGet("testconnection")]
//	[SwaggerOperation(Summary = "")]
//	[ProducesResponseType(typeof(LogoutResult), (int)HttpStatusCode.OK)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
//	public async Task<IActionResult> GetTestConnection()
//	{
//		var request = new TestConnectionQuery();
//		var res = await _mediator.Send(request);
//		return Ok(res);
//	}


//}
