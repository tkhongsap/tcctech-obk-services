using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.AddAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.Login;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword;
using TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword;
using TCCT.ServiceAbstraction.Domain;

namespace TCCT.ServiceAbstraction.Api.Controllers.Customer;

[ApiController]
[Route("api/v1/customer/kc")]
[ApiExplorerSettings(GroupName = "customerv1")]
public class CustomerKeycloakController : ControllerBase
{
	private readonly IMediator _mediator;
	public CustomerKeycloakController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("login")]
	[SwaggerOperation(Summary = "Customer login")]
	[ProducesResponseType(typeof(LoginResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostLogin([FromBody] LoginRequest request)
	{
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new LoginCommand(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
			request.Username, request.Password);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	//-- ไม่ต้องมี logout เพราะ front-end ไม่เคย logout, ส่วน backend ของ customer app ใช้เส้น login อย่างเดียว แล้วไปจัดการเรื่อง logout ด้วยตัวเอง
	//[HttpPost("logout")]
	//[SwaggerOperation(Summary = "Customer logout")]
	//[ProducesResponseType(typeof(LogoutResult), (int)HttpStatusCode.OK)]
	//[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	//[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//public async Task<IActionResult> PostLogout([FromBody] LogoutRequest request)
	//{
	//	var query = new LogoutCommand();
	//	var res = await _mediator.Send(query);
	//	return Ok(res);
	//}

	[HttpGet("user")]
	[SwaggerOperation(Summary = "User info")]
	[ProducesResponseType(typeof(GetUserResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	public async Task<IActionResult> GetUser(string username)
	{
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new GetUserQuery(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
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
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var query = new CreateUserCommand(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
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
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new AddAuthAliasCommand(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
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
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new RemoveAuthAliasCommand(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
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
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new ResetPasswordCommand(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
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
		if (string.IsNullOrEmpty(DomainConfig.Customer.Keycloak.Version)) throw KeycloakServiceException.KCS012;
		var command = new UpdatePasswordCommand(
			DomainConfig.Customer.Keycloak.Version,
			DomainConfig.Customer.Keycloak.EndPoint,
			DomainConfig.Customer.Keycloak.Realms,
			DomainConfig.Customer.Keycloak.RealmsAuthAttribute,
			DomainConfig.Customer.Keycloak.ClientID,
			DomainConfig.Customer.Keycloak.ClientSecret,
			request.Username, request.OldPassword, request.NewPassword);
		var res = await _mediator.Send(command);
		return Ok(res);
	}
}
