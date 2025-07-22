using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.CreateUserKC;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.Logout;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.RefreshToken;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.EventLogs.Command.CreateEventLog;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api;

[ApiController]
[Route("api/v1/operation/mobile/authentication")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
public class AuthenticationController : OperationApiControllerBase
{
  private readonly IMediator _mediator;
  private readonly IAuditableService _auditableService;
  public AuthenticationController(IMediator mediator, IAuditableService auditableService)
  {
    _mediator = mediator;
    _auditableService = auditableService;
  }

  [HttpPost("Login")]
  [SwaggerOperation(Summary = "Opp App login")]
  [ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> Login([FromBody] LoginCommand data)
  {
    var res = await _mediator.Send(data);
    setTokenCookie(res.RefreshToken);
    return Ok(res);
  }

  [HttpPost("RefreshToken")]
  [SwaggerOperation(Summary = "Opp App refreshToken")]
  [ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> RefreshToken(RefreshTokenCommand command)
  {
    var refreshToken = command.RefreshToken;
    if (string.IsNullOrEmpty(refreshToken))
    {
      refreshToken = Request.Cookies["refresh-token"];
    }
    if (string.IsNullOrEmpty(refreshToken))
    {
      return Unauthorized(new { Message = "Invalid Token" });
    }
    command.RefreshToken = refreshToken;
    var res = await _mediator.Send(command);
    setTokenCookie(res.RefreshToken);
    return Ok(res);
  }

  [HttpPost("Register")]
  [SwaggerOperation(Summary = "Opp App register")]
  [ProducesResponseType(typeof(CreateUserKCCommand), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
  public async Task<IActionResult> Register([FromBody] CreateUserKCCommand command)
  {
    command.CreatedDate = _auditableService.TimeStamp;
    command.CreatedBy = _auditableService.MID;
    command.CreatedByName = _auditableService.MemberName;
    command.UpdatedDate = _auditableService.TimeStamp;
    command.UpdatedBy = _auditableService.MID;
    command.UpdatedByName = _auditableService.MemberName;
    // command.CreatedDate = DateTime.Now;
    // command.CreatedBy = Guid.NewGuid();
    // command.CreatedByName = "test";
    // command.UpdatedDate = DateTime.Now;
    // command.UpdatedBy = command.CreatedBy;
    // command.UpdatedByName = "test";
    var res = await _mediator.Send(command);

    return Ok(res);
  }

  [HttpGet("OauthToken")]
  [SwaggerOperation(Summary = "get OauthToken")]
  [ProducesResponseType(typeof(GetOAuthTokenResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> OauthToken()
  {
    var query = new GetOAuthTokenQuery();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpPost("UATLogin")]
  [SwaggerOperation(Summary = "Ahoc UAT Demo Login")]
  [ProducesResponseType(typeof(UATLoginResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> UATLogin([FromBody] UATLoginCommand request)
  {
    var res = await _mediator.Send(request);
    return Ok(res);
  }

  [HttpPost("Logout")]
  [SwaggerOperation(Summary = "Opp App logout")]
  [ProducesResponseType(typeof(LogoutResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> Logout([FromBody] LogoutCommand data)
  {
    var res = await _mediator.Send(data);
    return Ok(res);
  }

  private void setTokenCookie(string token)
  {
    // append cookie with refresh token to the http response
    var cookieOptions = new CookieOptions
    {
      HttpOnly = true,
      Expires = DateTime.UtcNow.AddDays(7)
    };
    Response.Cookies.Append("refresh-token", token, cookieOptions);
  }

  [HttpPut("EventsLog")]
  [SwaggerOperation(Summary = "EventsLog List")]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  [ProducesResponseType(typeof(List<EventsLogResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> EventsLog([FromBody] CreateEventlogCommand command)
  {
    var res = await _mediator.Send(command);
    return Ok(res);
  }

}
