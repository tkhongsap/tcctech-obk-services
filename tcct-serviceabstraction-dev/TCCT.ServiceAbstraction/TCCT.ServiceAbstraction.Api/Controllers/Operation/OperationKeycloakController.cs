using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.AddAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.EventsLog;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.Login;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.RefreshToken;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword;
using TCCT.ServiceAbstraction.Domain;

namespace TCCT.ServiceAbstraction.Api.Controllers.Operation;

[ApiController]
[Route("api/v1/operation/kc")]
[ApiExplorerSettings(GroupName = "operationv1")]
public class OperationKeycloakController : ControllerBase
{
	private readonly IMediator _mediator;
	public OperationKeycloakController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("login")]
	[SwaggerOperation(Summary = "Operation login")]
	[ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostLogin([FromBody] LoginRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new LoginCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.Username, request.Password);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("refresh-token")]
	[SwaggerOperation(Summary = "Operation refresh token")]
	[ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new RefreshTokenCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.RefreshToken);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("user")]
	[SwaggerOperation(Summary = "User info")]
	[ProducesResponseType(typeof(GetUserResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> GetUser(string username)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new GetUserQuery(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			username);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("user")]
	[SwaggerOperation(Summary = "Create user, register user")]
	[ProducesResponseType(typeof(CreateUserResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> PostUser([FromBody] CreateUserRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new CreateUserCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.EmailOrPhone, request.Password, request.Firstname, request.Lastname);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("authalias")]
	[SwaggerOperation(Summary = "Add authentication alias")]
	[ProducesResponseType(typeof(AddAuthAliasResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> PostAuthAlias([FromBody] AddAuthAliasRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new AddAuthAliasCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.Username, request.NewAttribute);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpDelete("authalias")]
	[SwaggerOperation(Summary = "Remove authentication alias")]
	[ProducesResponseType(typeof(RemoveAuthAliasResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> DeleteAuthAlias([FromBody] RemoveAuthAliasRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new RemoveAuthAliasCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.Username, request.RemoveAttribute);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("password/reset")]
	[SwaggerOperation(Summary = "Reset password to the new one (no need old password)")]
	[ProducesResponseType(typeof(ResetPasswordResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> PostResetPassword([FromBody] ResetPasswordRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new ResetPasswordCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.Username, request.NewPassword);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPut("password")]
	[SwaggerOperation(Summary = "Update password, change password")]
	[ProducesResponseType(typeof(UpdatePasswordResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PutUpdatePassword([FromBody] UpdatePasswordRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Operation.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new UpdatePasswordCommand(
			DomainConfig.Operation.Keycloak.Version,
			DomainConfig.Operation.Keycloak.EndPoint,
			DomainConfig.Operation.Keycloak.Realms,
			DomainConfig.Operation.Keycloak.RealmsAuthAttribute,
			DomainConfig.Operation.Keycloak.ClientID,
			DomainConfig.Operation.Keycloak.ClientSecret,
			request.Username, request.OldPassword, request.NewPassword);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("staff_event_logs")]
	[SwaggerOperation(Summary = "Staff Event Logs")]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> GetUser([FromQuery] EventsLogRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Logger.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new EventsLogQuery(
			DomainConfig.Logger.Keycloak.Version,
			DomainConfig.Logger.Keycloak.EndPoint,
			DomainConfig.Logger.Keycloak.Realms,
			DomainConfig.Logger.Keycloak.RealmsAuthAttribute,
			DomainConfig.Logger.Keycloak.ClientID,
			DomainConfig.Logger.Keycloak.ClientSecret,
			request.Max, request.Type ?? "LOGIN", request.DateFrom, request.DateTo, request.First, request.User);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}