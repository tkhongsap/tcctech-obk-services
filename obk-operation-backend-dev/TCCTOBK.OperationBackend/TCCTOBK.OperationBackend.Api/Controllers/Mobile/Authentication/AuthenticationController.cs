// using System.Net;
// using MediatR;
// using Microsoft.AspNetCore.Mvc;
// using Swashbuckle.AspNetCore.Annotations;
// using TCCTOBK.OperationBackend.Api.Controllers;
// using TCCTOBK.OperationBackend.Application;
// using TCCTOBK.OperationBackend.Application.Features;
// using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.CreateUserKC;

// namespace TCCTOBK.OperationBackend.Api.Controller;
// [ApiController]
// [Route("api/mobile/v1/authentication")]
// [ApiExplorerSettings(GroupName = "operationv1")]
// public class AuthenticationController : OperationApiControllerBase
// {
//   private readonly IMediator _mediator;

//   public AuthenticationController(IMediator mediator)
//   {
//     _mediator = mediator;
//   }
//   [HttpPost("Login")]
//   [SwaggerOperation(Summary = "Opp App login")]
//   [ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> Login([FromBody] LoginCommand data)
//   {
//     var res = await _mediator.Send(data);
//     return Ok(res);
//   }

//   [HttpPost("Register")]
//   [SwaggerOperation(Summary = "Opp App register")]
//   [ProducesResponseType(typeof(CreateUserKCCommand), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> Register([FromBody] CreateUserKCCommand command)
//   {
//     var res = await _mediator.Send(command);
//     return Ok(res);
//   }

//   [HttpGet("OauthToken")]
//   [SwaggerOperation(Summary = "get OauthToken")]
//   [ProducesResponseType(typeof(GetOAuthTokenResult), (int)HttpStatusCode.OK)]
//   [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   public async Task<IActionResult> OauthToken()
//   {
//     var query = new GetOAuthTokenQuery();
//     var res = await _mediator.Send(query);
//     return Ok(res);
//   }

//   #region legacyCode 
//   // [HttpPost("Login")]
//   // [SwaggerOperation(Summary = "Opp App login")]
//   // [ProducesResponseType(typeof(LoginCommand), (int)HttpStatusCode.OK)]
//   // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   // public async Task<IActionResult> Login([FromBody] LoginCommand data)
//   // {
//   //   var res = await _mediator.Send(data);
//   //   return Ok(res);
//   // }

//   // [HttpPost("Register")]
//   // [SwaggerOperation(Summary = "Opp App register")]
//   // [ProducesResponseType(typeof(CreateUserKCCommand), (int)HttpStatusCode.OK)]
//   // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   // public async Task<IActionResult> Register([FromBody] CreateUserKCCommand command)
//   // {
//   // 	var res = await _mediator.Send(command);
//   // 	return Ok(res);
//   // }

//   // [HttpGet("OauthToken")]
//   // [SwaggerOperation(Summary = "get OauthToken")]
//   // [ProducesResponseType(typeof(GetOAuthTokenResult), (int)HttpStatusCode.OK)]
//   // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   // public async Task<IActionResult> OauthToken()
//   // {
//   //   var query = new GetOAuthTokenQuery();
//   //   var res = await _mediator.Send(query);
//   //   return Ok(res);
//   // }
//   // [HttpGet("KeycloalToken")]
//   // [SwaggerOperation(Summary = "get KeycloakToken")]
//   // [ProducesResponseType(typeof(GetKeycloakTokenResult), (int)HttpStatusCode.OK)]
//   // [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
//   // [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
//   // public async Task<IActionResult> KeycloakToken()
//   // {
//   //   var query = new GetKeycloakTokenQuery();
//   //   var res = await _mediator.Send(query);
//   //   return Ok(res);
//   // }
//   #endregion
// }
