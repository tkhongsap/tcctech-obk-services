using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Command.ImportLog;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.Attendance;
[Route("api/v1")]
[ApiController]
[ApiExplorerSettings(GroupName = "socv1")]
public class AttendanceController : ControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;

	public AttendanceController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}


	[HttpPost("Attendant/import")]
	[SwaggerOperation(Summary = "Import checkin checkout log")]
	[ProducesResponseType(typeof(ImportLogResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ImportLog([FromBody] ImportLogCommand command)
	{
		var res = await _mediator.Send(command);
		return Ok(new SuccessResponse<ImportLogResult>(res));
	}

}
