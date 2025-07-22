using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.CreateRole;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.RemoveRole;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateRole;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateStatusRole;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRole;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRoles;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.RoleManagement;
[Route("api/v1")]
[ApiController]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class RoleMangementController : ControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public RoleMangementController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpGet("Roles")]
	[SwaggerOperation(Summary = "Get Role List")]
	[ProducesResponseType(typeof(GetRolesResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRoles([FromQuery] GetRolesQuery query)
	{
		var res = await _mediator.Send(query);
		return Ok(new SuccessResponse<GetRolesResult>(res));

	}

	[HttpGet("Role/{ID}")]
	[SwaggerOperation(Summary = "Get Role By Id")]
	[ProducesResponseType(typeof(GetRoleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRole(string id)
	{
		var query = new GetRoleQuery(id);
		var res = await _mediator.Send(query);
		return Ok(new SuccessResponse<GetRoleResult>(res));
	}

	[HttpGet("Role/Privileges")]
	[SwaggerOperation(Summary = "Get Privileges Data")]
	[ProducesResponseType(typeof(List<GetPrivilegesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetRolePrivileges()
	{
		var query = new GetPrivilegesQuery();
		var res = await _mediator.Send(query);
		return Ok(new SuccessResponse<List<GetPrivilegesResult>>(res));
	}


	[HttpPost("Role")]
	[SwaggerOperation(Summary = "Create Role")]
	[ProducesResponseType(typeof(CreateRoleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateRole([FromBody] CreateRoleCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<CreateRoleResult>(res));

	}

	[HttpPut("Role")]
	[SwaggerOperation(Summary = "Update Role")]
	[ProducesResponseType(typeof(UpdateRoleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateRoleResult>(res));
	}

	[HttpPut("Role/Status")]
	[SwaggerOperation(Summary = "Update Role Status")]
	[ProducesResponseType(typeof(UpdateStatusRoleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateRoleStatus([FromBody] UpdateStatusRoleCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateStatusRoleResult>(res));
	}

	//[HttpPost("Role/Privilege")]
	//[SwaggerOperation(Summary = "Create Privileage and Privilege Item")]
	//[ProducesResponseType(typeof(CreatePrivilegesResult), (int)HttpStatusCode.OK)]
	//[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	//[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	//public async Task<IActionResult> CreatePrivilege([FromBody] CreatePrivilegeCommand request)
	//{
	//	var res = await _mediator.Send(request);
	//	return Ok(new SuccessResponse<CreatePrivilegesResult>(res));
	//}

	[HttpDelete("Role/Remove/{roleId}")]
	[SwaggerOperation(Summary = "Remove role")]
	[ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> RemoveRole(string roleId)
	{
		var command = new RemoveRoleCommand(roleId);
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		await _mediator.Send(command);
		return Ok(new { Message = "Remove success" });
	}
}
