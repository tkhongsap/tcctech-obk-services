using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.InviteMember;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.IsActiveAccount;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.ResendInviteMember;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UnblockAccount;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UpdateMember;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UpdateStatusMember;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSoc;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSocWithOutActive;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberKeyCloakUserId;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembers;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembersByRole;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembersOpsApp;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.StampUpdatedMember;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.MemberManagement;

[Route("api/v1")]
[ApiController]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class MemberManagementController : ControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;

	public MemberManagementController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpGet("Members")]
	[SwaggerOperation(Summary = "Get Member List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetMemberResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMembers([FromQuery] GetMembersQuery query)
	{
		query.TenantIds = new List<Guid> { Constant.TENANT_OBKCMS_ID };
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("MembersOpsApp")]
	[SwaggerOperation(Summary = "Get Member OpsApp List")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetMemberResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMembersOpsApp([FromQuery] GetMembersOpsAppQuery query)
	{
		query.TenantIds = new List<Guid> { Constant.TENANT_OPERATION_APP_ID };
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("MembersOpsApp/isActive")]
	[SwaggerOperation(Summary = "isActive member account")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(IsActiveAccountResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> isActiveAccount([FromBody] IsActiveAccountCommand command)
	{
		var res = await _mediator.Send(command);
		if (_auditableService.MID != null)
		{
			await _mediator.Send(new StampUpdatedMemberCommand
			{
				MID = command.MID,
				UpdatedBy = _auditableService.MID,
				UpdatedByName = _auditableService.MemberName
			});
		}
		return Ok(res);
	}

	[HttpPost("MembersOpsApp/UnblockAccount")]
	[SwaggerOperation(Summary = "Unblock member account")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UnblockAccountResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UnblockAccount([FromBody] UnblockAccountCommand command)
	{
		var res = await _mediator.Send(command);
		if (_auditableService.MID != null)
		{
			await _mediator.Send(new StampUpdatedMemberCommand
			{
				MID = command.MID,
				UpdatedBy = _auditableService.MID,
				UpdatedByName = _auditableService.MemberName
			});
		}
		return Ok(res);
	}


	[HttpGet("Member/{id}")]
	[SwaggerOperation(Summary = "Get Member by Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMember(string id)
	{
		var query = new GetMemberQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("MemberAndSOC/{id}")]
	[SwaggerOperation(Summary = "Get MemberAndSOC by Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetMemberAndSocResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMemberAndSOC(string id)
	{
		var query = new GetMemberAndSocQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
	[HttpGet("MemberAndSOCWithOutActive/{id}")]
	[SwaggerOperation(Summary = "Get MemberAndSOC by Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetMemberAndSocWithOutActiveResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMemberAndSOCWithOutActive(string id)
	{
		var query = new GetMemberAndSocWithOutActiveQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Member/KeyCloakId/{id}")]
	[SwaggerOperation(Summary = "Get Member By KeyCloak Id")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(GetMemberKeyCloakUserIdResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMemberByKeyCloakId(string id)
	{
		var query = new GetMemberKeyCloakUserIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Member/InviteMember")]
	[SwaggerOperation(Summary = "Invite Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(InviteMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> InviteMember([FromBody] InviteMemberCommand command)
	{
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<InviteMemberResult>(res));
	}

	[HttpPost("Member/ResendInvite")]
	[SwaggerOperation(Summary = "Invite Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(ResendInviteMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ResendInvite(Guid id)
	{
		var command = new ResendInviteMemberCommand(id);
		command.CreatedDate = _auditableService.TimeStamp;
		command.CreatedBy = _auditableService.MID;
		command.CreatedByName = _auditableService.MemberName;
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<ResendInviteMemberResult>(res));
	}

	[HttpPut("Member")]
	[SwaggerOperation(Summary = "Update Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateMember([FromBody] UpdateMemberCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateMemberResult>(res));
	}

	[HttpPut("Member/Active")]
	[SwaggerOperation(Summary = "Active Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ActiveMember([FromBody] UpdateMemberCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = Constant.TENANT_OBKCMS_ID;
		command.UpdatedByName = command.Name;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateMemberResult>(res));
	}

	[HttpPut("Member/Status")]
	[SwaggerOperation(Summary = "Update Status Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateStatusMemberResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateStatusMember([FromBody] UpdateStatusMemberCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<UpdateStatusMemberResult>(res));
	}

	[HttpPut("Member/Role")]
	[SwaggerOperation(Summary = "Update Status Member")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(UpdateMemberWithRoleResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateMemberWithRole([FromBody] UpdateMemberWithRoleCommand command)
	{
		command.UpdatedDate = _auditableService.TimeStamp;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var res = await _mediator.Send(command);
		return Ok(res);
	}


	[HttpGet("Member/InviteMember")]
	[SwaggerOperation(Summary = "Chck InviteCode Is Valid")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(bool), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CheckInviteMember(Guid id, string invitemember)
	{
		var query = new GetInviteMemberCodeQuery(invitemember, id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Member/GetMembersByRole/{roleId}")]
	[SwaggerOperation(Summary = "Get members by role")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<GetMemberResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetMemebersByRole(string roleId)
	{
		var query = new GetMemebersByRoleQuery(roleId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("Member/ForgotPassword")]
	[SwaggerOperation(Summary = "Forgot Password")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<string>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var result = await _mediator.Send(command);
		return Ok(result);
	}
	[HttpPost("Member/ResetPassword")]
	[SwaggerOperation(Summary = "Reset Password")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<string>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var result = await _mediator.Send(command);
		return Ok(result);
	}
	[HttpGet("Member/VerifyResetPasswordToken/{id}")]
	[SwaggerOperation(Summary = "Get Reset Password")]
	[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
	[ProducesResponseType(typeof(List<string>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetResetPassword(string id)
	{
		var query = new GetResetPasswordQuery(id);
		var result = await _mediator.Send(query);
		return Ok(result);
	}

}
