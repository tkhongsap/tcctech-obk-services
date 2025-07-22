using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignSupervisor;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignTechnician;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.CheckListMaps;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ClientVerify;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Close;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Complete;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMMasterWorkOrder;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Rework;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.SupervisorReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Task;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.TechnicianReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Transactions;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.UpdateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMUpdate;

namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class PlanAndPreventiveMaintenanceController : ControllerBase
{
	private readonly IMediator _mediator;
	public PlanAndPreventiveMaintenanceController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("PPM/WorkOrder/Create")]
	[SwaggerOperation(Summary = "Create ppm work order")]
	[ProducesResponseType(typeof(PPMWOResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PPMWO([FromBody] PPMWORequest body)
	{
		var command = new PPMWOCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("PPM/Assign/Supervisor")]
	[SwaggerOperation(Summary = "Assign Supervisor")]
	[ProducesResponseType(typeof(AssignSupervisorResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PPMAssignSupervisor([FromBody] AssignSupervisorRequest body)
	{
		var command = new AssignSupervisorCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("PPM/Assign/Technician")]
	[SwaggerOperation(Summary = "Assign Technician")]
	[ProducesResponseType(typeof(AssignTechnicianResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PPMAssignTechnician([FromBody] AssignTechnicianRequest body)
	{
		var command = new AssignTechnicianCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("PPM/Supervisor/Reject")]
	[SwaggerOperation(Summary = "Supervisor Reject PPM")]
	[ProducesResponseType(typeof(SupervisorRejectResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PPMSupervisorReject([FromBody] SupervisorRejectRequest body)
	{
		var command = new SupervisorRejectCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("PPM/Technician/Reject")]
	[SwaggerOperation(Summary = "Technician Reject")]
	[ProducesResponseType(typeof(TechnicianRejectResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> TechnicianReject([FromBody] TechnicianRejectRequest body)
	{
		var command = new TechnicianRejectCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("PPM/Technician/Acknowldge")]
	[SwaggerOperation(Summary = "Acknowledge Assignment")]
	[ProducesResponseType(typeof(AcknowledgeAssignmentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AcknowledgeAssignment([FromBody] AcknowledgeAssignmentRequest body)
	{
		var command = new AcknowledgeAssignmentCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpPost("PPM/Comment")]
	[SwaggerOperation(Summary = "Comment")]
	[ProducesResponseType(typeof(CommentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Comment([FromBody] CommentRequest body)
	{
		var command = new CommentCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("PPM/Task/{workOrderId}")]
	[SwaggerOperation(Summary = "Get Task of the Work Order")]
	[ProducesResponseType(typeof(List<TaskResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTaskFromWorkOrder(string workOrderId)
	{
		var query = new TaskQuery(workOrderId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/ServicingObject/{workOrderId}")]
	[SwaggerOperation(Summary = "Get servicing object from work oder id")]
	[ProducesResponseType(typeof(List<ServicingObjectResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSevicingObjectFromWorkOrder(string workOrderId)
	{
		var query = new ServicingObjectQuery(workOrderId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("PPM/Task/Update")]
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

	[HttpPost("PPM/Task/ConfirmCompletion")]
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

	[HttpPost("PPM/Task/Complete")]
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

	[HttpPost("PPM/Task/Rework")]
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

	[HttpPost("PPM/ClientVerify")]
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

	[HttpPost("PPM/Task/Close")]
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

	[HttpGet("PPM/PPMWOS")]
	[SwaggerOperation(Summary = "Get All PPM Work Order List")]
	[ProducesResponseType(typeof(List<PPMMasterResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPPMWOS()
	{
		var query = new PPMMasterQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/PPMMWOS")]
	[SwaggerOperation(Summary = "Get All Master PPM Work Order List")]
	[ProducesResponseType(typeof(List<PPMMasterWorkOrderResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPPMMasterWorkOrder()
	{
		var query = new PPMMasterWorkOrderQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/CheckListMaps")]
	[SwaggerOperation(Summary = "Get PPM CheckListMaps")]
	[ProducesResponseType(typeof(List<CheckListMapsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCheckListMaps()
	{
		var query = new CheckListMapsQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/Technicians/{id}")]
	[SwaggerOperation(Summary = "Get PPM Technicians")]
	[ProducesResponseType(typeof(List<TechniciansResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTechnicians(string id)
	{
		var query = new TechniciansQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/Comments/{woid}")]
	[SwaggerOperation(Summary = "Get PPM Comments by ID")]
	[ProducesResponseType(typeof(List<CommentsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetComments(string woid)
	{
		var query = new CommentsQuery(woid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/Transactions/{woid}")]
	[SwaggerOperation(Summary = "Get PPM Transactions by ID ")]
	[ProducesResponseType(typeof(List<CommentsResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetTransactions(string woid)
	{
		var query = new TransactionsQuery(woid);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/Documents/{id}/Related")]
	[SwaggerOperation(Summary = "Get Documents Related By Id")]
	[ProducesResponseType(typeof(List<PPMDocumentsRelatedByIdResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DocumentsRelatedById(string id)
	{
		var query = new DocumentsRelatedByIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("PPM/ppmupdates")]
	[SwaggerOperation(Summary = "Get PPM Updates List")]
	[ProducesResponseType(typeof(List<PPMUpdateResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PPMUpdate([FromQuery] PPMUpdateQuery? query)
	{
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
