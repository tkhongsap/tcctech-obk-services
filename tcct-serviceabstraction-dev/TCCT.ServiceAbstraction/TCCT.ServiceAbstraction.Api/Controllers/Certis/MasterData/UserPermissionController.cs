using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.FunctionRole;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroup;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupById;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupinfoById;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupUserByUserId;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserPermissions;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserProfile;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserProfileById;


namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.MasterData;

[Route("api/v1")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class UserPermissionController : ControllerBase
{
	private readonly IMediator _mediator;
	public UserPermissionController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("UserPermission/UsersProfile")]
	[SwaggerOperation(Summary = "Get all User ")]
	[ProducesResponseType(typeof(List<UserProfileResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetUser()
	{
		var query = new UserProfileQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	//User by ID waitng
	[HttpGet("UserPermission/Myprofile/{userid}")]
	[SwaggerOperation(Summary = "Get profile by ID")]
	[ProducesResponseType(typeof(List<UserProfileByIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetUserProfileById(string userid)
	{
		var query = new UserProfileByIdQuery(userid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("UserPermission/Userpermission")]
	[SwaggerOperation(Summary = "Get UserPermission ")]
	[ProducesResponseType(typeof(List<UserPermissionsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetUserPermissions()
	{
		var query = new UserPermissionsQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("UserPermission/Group")]
	[SwaggerOperation(Summary = "Get Permission group ")]
	[ProducesResponseType(typeof(List<PermissionGroupResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPermissionGroup()
	{
		var query = new PermissionGroupQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	//waitng group by ID waitng 1
	[HttpGet("UserPermission/Permissiongroup/{groupid}/Permissioninfo")]
	[SwaggerOperation(Summary = "Get Permission groupinfo by groupId ")]
	[ProducesResponseType(typeof(List<PermissionGroupinfoByIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPermissionGroupinfoById(string groupid)
	{
		var query = new PermissionGroupinfoByIdQuery(groupid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	//waitng group by ID waitng 2
	[HttpGet("UserPermission/Permissiongroup/{groupid}/permission")]
	[SwaggerOperation(Summary = "Get Permission group by Id ")]
	[ProducesResponseType(typeof(List<PermissionGroupByIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPermissionGroupById(string groupid)
	{
		var query = new PermissionGroupByIdQuery(groupid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	//waitng group by user ID waitng 3
	[HttpGet("UserPermission/Permissiongroup/{userid}/user")]
	[SwaggerOperation(Summary = "Get Permission group by user id ")]
	[ProducesResponseType(typeof(List<PermissionGroupUserByUserIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPermissionGroupUserByUserId(string userid)
	{
		var query = new PermissionGroupUserByUserIdQuery(userid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("UserPermission/Functionrole")]
	[SwaggerOperation(Summary = "Get Functionrole  ")]
	[ProducesResponseType(typeof(List<FunctionRoleResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFunctionRole()
	{
		var query = new FunctionRoleQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}


}
