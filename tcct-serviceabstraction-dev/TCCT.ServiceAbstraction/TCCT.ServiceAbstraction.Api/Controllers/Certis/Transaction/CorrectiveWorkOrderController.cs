using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignSupervisor;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignTechnician;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ClientVerify;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Close;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Complete;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Master;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Rework;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupportiveTeam;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Task;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.TechnicianReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Transactions;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.UpdateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWOUpdate;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;

namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;
[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class CorrectiveWorkOrderController : ControllerBase
{
	private readonly IMediator _mediator;
	public CorrectiveWorkOrderController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("CWO/CWO")]
	[SwaggerOperation(Summary = "Create CWO")]
	[ProducesResponseType(typeof(CWOResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostCWO([FromBody] CWORequest body)
	{
		var command = new CWOCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Assign/Supervisor")]
	[SwaggerOperation(Summary = "Assign Supervisor")]
	[ProducesResponseType(typeof(AssignSupervisorResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostAssignSupervisor([FromBody] AssignSupervisorRequest body)
	{
		var command = new AssignSupervisorCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Supervisor/Reject")]
	[SwaggerOperation(Summary = "Reject Supervisor CWO")]
	[ProducesResponseType(typeof(SupervisorRejectResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostSupervisorReject([FromBody] SupervisorRejectRequest body)
	{
		var command = new SupervisorRejectCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Assign/Technician")]
	[SwaggerOperation(Summary = "Assign Technician")]
	[ProducesResponseType(typeof(AssignTechnicianResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostAssignTechnician([FromBody] AssignTechnicianRequest body)
	{
		var command = new AssignTechnicianCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Technician/Reject")]
	[SwaggerOperation(Summary = "Reject Technician CWO")]
	[ProducesResponseType(typeof(TechnicianRejectResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostTecnicianReject([FromBody] TechnicianRejectRequest body)
	{
		var command = new TechnicianRejectCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Acknowledge/Assignment")]
	[SwaggerOperation(Summary = "Acknowledge Assignment")]
	[ProducesResponseType(typeof(AcknowledgeAssignmentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostAcknowledgeAssignment([FromBody] AcknowledgeAssignmentRequest body)
	{
		var command = new AcknowledgeAssignmentCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Comment")]
	[SwaggerOperation(Summary = "Post Comment")]
	[ProducesResponseType(typeof(Application.Features.Certis.Transaction.CWO.Comment.Command.CommentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PostComment([FromBody] CommentRequest body)
	{
		var command = new CommentCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Pause")]
	[SwaggerOperation(Summary = "Pause CWO")]
	[ProducesResponseType(typeof(PauseResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Pause([FromBody] PauseRequest body)
	{
		var command = new PauseCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Resume")]
	[SwaggerOperation(Summary = "Resume CWO")]
	[ProducesResponseType(typeof(ResumeResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Resume([FromBody] ResumeRequest body)
	{
		var command = new ResumeCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Work/Offline")]
	[SwaggerOperation(Summary = "Work Offline")]
	[ProducesResponseType(typeof(WorkOfflineResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> WorkOffline([FromBody] WorkOfflineRequest body)
	{
		var command = new WorkOfflineCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Task/Update")]
	[SwaggerOperation(Summary = "Update Task")]
	[ProducesResponseType(typeof(UpdateTaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateTask([FromBody] UpdateTaskRequest body)
	{
		var command = new UpdateTaskCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Task/ConfirmCompletion")]
	[SwaggerOperation(Summary = "Confirm Completion Task")]
	[ProducesResponseType(typeof(ConfirmTaskCompletionResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ConfirmTaskCompletion([FromBody] ConfirmTaskCompletionRequest body)
	{
		var command = new ConfirmTaskCompletionCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Task/Complete")]
	[SwaggerOperation(Summary = "Complete Task")]
	[ProducesResponseType(typeof(CompleteResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Complete([FromBody] CompleteRequest body)
	{
		var command = new CompleteCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Task/Rework")]
	[SwaggerOperation(Summary = "Rework Task")]
	[ProducesResponseType(typeof(ReworkResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Rework([FromBody] ReworkRequest body)
	{
		var command = new ReworkCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/Task/Close")]
	[SwaggerOperation(Summary = "Close Task")]
	[ProducesResponseType(typeof(CloseResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Close([FromBody] CloseRequest body)
	{
		var command = new CloseCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("CWO/ClientVerify")]
	[SwaggerOperation(Summary = "Client Verify")]
	[ProducesResponseType(typeof(ClientVerifyResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ClientVerify([FromBody] ClientVerifyRequest body)
	{
		var command = new ClientVerifyCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("CWO/Comment")]
	[SwaggerOperation(Summary = "Get comment")]
	[ProducesResponseType(typeof(Application.Features.Certis.Transaction.CWO.Comment.Query.CommentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetComment(string cwoId)
	{
		var command = new CommentQuery(cwoId);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("CWO/Task")]
	[SwaggerOperation(Summary = "Get sub task from CWO")]
	[ProducesResponseType(typeof(TaskResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTask(string cwoId)
	{
		var command = new TaskQuery(cwoId);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("CWO/CWOS")]
	[SwaggerOperation(Summary = "Get All Corrective Work Order")]
	[ProducesResponseType(typeof(List<CWOMasterResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCWOS()
	{
		var query = new CWOMasterQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CWO/SupportiveTeam/{id}")]
	[SwaggerOperation(Summary = "Get SupportiveTeam By Id")]
	[ProducesResponseType(typeof(List<SupportiveTeamResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSupportiveTeam(string id)
	{
		var query = new SupportiveTeamQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CWO/Transactions/{id}")]
	[SwaggerOperation(Summary = "Get Transactions By Id")]
	[ProducesResponseType(typeof(List<TransactionsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTransactions(string id)
	{
		var query = new TransactionsQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CWO/CommentById/{id}")]
	[SwaggerOperation(Summary = "Get Comments By Id")]
	[ProducesResponseType(typeof(List<TransactionsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCommentById(string id)
	{
		var query = new CommentByIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CWO/Documents/{id}/Related")]
	[SwaggerOperation(Summary = "Get Documents Related By Id")]
	[ProducesResponseType(typeof(List<DocumentsRelatedByIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DocumentsRelatedById(string id)
	{
		var query = new DocumentsRelatedByIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("CWO/cwoupdates")]
	[SwaggerOperation(Summary = "Get CWO Updates List")]
	[ProducesResponseType(typeof(List<CWOUpdateResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CWOUpdate([FromQuery] CWOUpdateQuery? query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("CWO/CWOExternal")]
	[SwaggerOperation(Summary = "Create CWO for external")]
	[ProducesResponseType(typeof(CreateCWOExternalResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateCWOExternal([FromBody] CreateCWOExternalCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}
}
