using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateRole;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.AdhocUpdateDatajsonUser;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetAllAccount;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetUpdateMozartSupervisorTechnicain;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockIn;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.ClockOut;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command.StampUpdatedMember;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.UserClientStie;
using TCCTOBK.OperationBackend.Application.Features.Operation.FCM.Command.UpsertFCM;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Infrastructure.SeedData;

namespace TCCTOBK.OperationBackend.Api;

[ApiController]
[Route("api/v1/operation/mobile/user")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
public class UserController : OperationApiControllerBase
{
  private readonly IMediator _mediator;
  private readonly IAuditableService _auditableService;

  public UserController(IMediator mediator, IAuditableService auditableService)
  {
    _mediator = mediator;
    _auditableService = auditableService;
  }

  [HttpGet("profile")]
  [SwaggerOperation(Summary = "Get UserProfile")]
  [ProducesResponseType(typeof(ProfileResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  [MiddlewareFilter(typeof(ClientSiteAuthMiddlewarePipeline))]
  public async Task<IActionResult> UserProfile([FromQuery] string kcusername)
  {
    var query = new ProfileQuery(kcusername);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("Users")]
  [SwaggerOperation(Summary = "Get User List")]
  [ProducesResponseType(typeof(GetAllAccountResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetUsers([FromQuery] GetAllAccountQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("MozartSupTech")]
  [SwaggerOperation(Summary = "Get Update Mozart Supervisor Technicain Data")]
  [ProducesResponseType(typeof(GetUpdateMozartSupervisorTechnicainResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetMozartSupTechData(string email, Guid? mozartId)
  {
    var query = new GetUpdateMozartSupervisorTechnicainQuery(email, mozartId);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("AhocDataUserMozart")]
  [SwaggerOperation(Summary = "Get Update Mozart Supervisor Technicain Data")]
  [ProducesResponseType(typeof(AdhocUpdateDatajsonUserResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> AhocDataUserMozart()
  {
    var query = new AdhocUpdateDatajsonUserCommand();
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpPost("Role")]
  [SwaggerOperation(Summary = "Update Role")]
  [ProducesResponseType(typeof(UpdateRoleResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult> UpdateUserRole([FromBody] UpdateRoleOpsAppCommand request)
  {
    var res = await _mediator.Send(request);
    if (_auditableService.MID != null)
    {
      await _mediator.Send(new StampUpdatedMemberCommand
      {
        MID = request.UserId,
        UpdatedBy = _auditableService.MID,
        UpdatedByName = _auditableService.MemberName
      });
    }
    return Ok();
  }


  [HttpGet("OpsappPermission")]
  [SwaggerOperation(Summary = "Get Update Mozart Supervisor Technicain Data")]
  [ProducesResponseType(typeof(AdhocUpdateDatajsonUserResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult> OpsappPermission(int role)
  {
    var dt = new OpsappPermissionData();
    var res = new List<string>();
    if (role == 1)
    {
      return Ok(dt.FMCSupervisorPermission());
    }
    if (role == 2)
    {
      return Ok(dt.GUARDPermission());
    }
    if (role == 3)
    {
      return Ok(dt.OUTSOURCEPermission());
    }
    if (role == 4)
    {
      return Ok(dt.DCCPermission());
    }
    if (role == 5)
    {
      return Ok(dt.FMCManagerPermission());
    }
    if (role == 6)
    {
      return Ok(dt.SOCManager());
    }
    if (role == 99)
    {
      return Ok(dt.SuperAdmin());
    }
    return Ok(new List<string>());
  }

  [HttpPost("UpsertFCM")]
  [SwaggerOperation(Summary = "Upsert FCM")]
  [ProducesResponseType(typeof(UpsertFCMResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult> UpdateUserRole([FromBody] UpsertFCMCommand request)
  {
    _ = await _mediator.Send(request);
    return Ok();
  }

  [HttpGet("UserClientSite")]
  [SwaggerOperation(Summary = "Get User Client Site")]
  [ProducesResponseType(typeof(UserClientStieResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult> UserClientSite([FromQuery] string kcusername)
  {
    var query = new UserClientStieQuery(kcusername);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpPut("ChangePasswordByUser")]
  [SwaggerOperation(Summary = "Change Password Mobile Application By User")]
  [ProducesResponseType(typeof(ChangePasswordMBResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> ChangePasswordMB([FromBody] ChangePasswordMBCommand command)
  {
    command.UpdatedDate = DateTime.Now;
    command.UpdatedBy = _auditableService.MID;
    command.UpdatedByName = _auditableService.MemberName;
    var result = await _mediator.Send(command);
    return Ok(result);
  }


  [HttpPost("UserClockIn")]
  [SwaggerOperation(Summary = "User Clock In")]
  [ProducesResponseType(typeof(UserClockInResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> UserClockIn([FromBody] UserClockInCommand command)
  {
    var result = await _mediator.Send(command);
    return Ok(result);
  }

  [HttpPost("UserClockOut")]
  [SwaggerOperation(Summary = "User Clock Out")]
  [ProducesResponseType(typeof(UserClockOutResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> UserClockOut([FromBody] UserClockOutCommand command)
  {
    var result = await _mediator.Send(command);
    return Ok(result);
  }
}
