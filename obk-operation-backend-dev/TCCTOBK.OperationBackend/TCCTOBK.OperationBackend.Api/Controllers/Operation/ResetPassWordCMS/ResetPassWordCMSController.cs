using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.ResetPasswordCMS;

[ApiController]
[Route("api/v1/ResetPasswordByAdmin/")]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class ResetPasswordCMSController : ControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public ResetPasswordCMSController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpPost("ResetPasswordToDefault")]
	[SwaggerOperation(Summary = "Reset Password to Default")]
	[ProducesResponseType(typeof(ResetPasswordCMSResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ResetPasswordToDefaultCMS([FromBody] ResetPasswordCMSCommand command)
	{
		command.UpdatedDate = DateTime.Now;
		command.UpdatedBy = _auditableService.MID;
		command.UpdatedByName = _auditableService.MemberName;
		var result = await _mediator.Send(command);
		return Ok(result);
	}

}

