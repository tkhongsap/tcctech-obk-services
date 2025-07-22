using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Management;
using System.Net;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffList;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Command.Problem.Create;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.upload;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.UploadMultiple;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.Upsert;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Event;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Problem;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest.GetServiceRequest;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Api.Controllers.Operation.UsageMonitoring;

[ApiController]
[Route("api/v1/urgent/")]
[ApiExplorerSettings(GroupName = "urgent")]
public class UrgentController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IAuditableService _auditableService;
    public UrgentController(IMediator mediator, IAuditableService auditableService)
    {
        _mediator = mediator;
        _auditableService = auditableService;
    }

    [HttpGet("event")]
    [SwaggerOperation(Summary = "event List")]
    [ProducesResponseType(typeof(GetStaffListResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> EventList([FromQuery] SREventQuery data)
    {
        var res = await _mediator.Send(data);
        return Ok(res);
    }

    [HttpPost("event")]
    [SwaggerOperation(Summary = "add event")]
    [ProducesResponseType(typeof(mtSREvent), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> AddEvent([FromBody] EventCommand command)
    {
        // command.CreatedDate = _auditableService.TimeStamp;
        // command.CreatedBy = _auditableService.MID;
        // command.CreatedByName = _auditableService.MemberName;
        // command.UpdatedDate = _auditableService.TimeStamp;
        // command.UpdatedBy = _auditableService.MID;
        // command.UpdatedByName = _auditableService.MemberName;
        command.CreatedDate = DateTime.Now;
        command.CreatedBy = Guid.NewGuid();
        command.CreatedByName = "test1";
        command.UpdatedDate = DateTime.Now;
        command.UpdatedBy = command.CreatedBy;
        command.UpdatedByName = "test1";
        var res = await _mediator.Send(command);
        return Ok(new SuccessResponse<mtSREvent>(res));
    }

    [HttpGet("problem")]
    [SwaggerOperation(Summary = "problem List")]
    [ProducesResponseType(typeof(GetStaffListResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ProblemList([FromQuery] ProblemQuery data)
    {
        var res = await _mediator.Send(data);
        return Ok(res);
    }

    [HttpPost("problem")]
    [SwaggerOperation(Summary = "add problem")]
    [ProducesResponseType(typeof(mtSRProblem), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> AddProblem([FromBody] ProblemCommand command)
    {
        // command.CreatedDate = _auditableService.TimeStamp;
        // command.CreatedBy = _auditableService.MID;
        // command.CreatedByName = _auditableService.MemberName;
        // command.UpdatedDate = _auditableService.TimeStamp;
        // command.UpdatedBy = _auditableService.MID;
        // command.UpdatedByName = _auditableService.MemberName;
        command.CreatedDate = DateTime.Now;
        command.CreatedBy = Guid.NewGuid();
        command.CreatedByName = "test1";
        command.UpdatedDate = DateTime.Now;
        command.UpdatedBy = command.CreatedBy;
        command.UpdatedByName = "test1";
        var res = await _mediator.Send(command);
        return Ok(new SuccessResponse<mtSRProblem>(res));
    }

    [HttpGet("service-request")]
    [SwaggerOperation(Summary = "service-request List")]
    [ProducesResponseType(typeof(GetStaffListResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ServiceRequestList([FromQuery] ServiceRequestQuery data)
    {
        var res = await _mediator.Send(data);
        return Ok(res);
    }

    [HttpGet("service-request/{id}")]
    [SwaggerOperation(Summary = "Get service-request By Id")]
    [ProducesResponseType(typeof(trServiceRequest), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetStaffById(Guid id)
    {
        var query = new GetServiceRequestQuery(id);
        var res = await _mediator.Send(query);
        return Ok(res);
    }

    [HttpPost("service-request/upsert")]
    [SwaggerOperation(Summary = "service-request Staff")]
    [ProducesResponseType(typeof(trServiceRequest), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> Upsert([FromBody] UpsertServiceRequestCommand command)
    {
        // command.CreatedDate = _auditableService.TimeStamp;
        // command.CreatedBy = _auditableService.MID;
        // command.CreatedByName = _auditableService.MemberName;
        // command.UpdatedDate = _auditableService.TimeStamp;
        // command.UpdatedBy = _auditableService.MID;
        // command.UpdatedByName = _auditableService.MemberName;
        command.CreatedDate = DateTime.Now;
        command.CreatedBy = Guid.NewGuid();
        command.CreatedByName = "test1";
        command.UpdatedDate = DateTime.Now;
        command.UpdatedBy = command.CreatedBy;
        command.UpdatedByName = "test1";
        var res = await _mediator.Send(command);
        return Ok(new SuccessResponse<trServiceRequest>(res));
    }

    [HttpPost("Upload")]
    [SwaggerOperation(Summary = "uploadImage")]
    [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult> Upload([FromForm] UploadCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("Upload-multiple")]
    [SwaggerOperation(Summary = "uploadImage Multiple")]
    [ProducesResponseType(typeof(byte[]), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult> GetDefaultIcon([FromBody] UploadMultipleCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    
    [HttpGet("location")]
    [SwaggerOperation(Summary = "Get location configuration")]
    [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public IActionResult GetLocation()
    {
        var locationConfig = JsonSerializer.Deserialize<object>(Constant.URGENTLOCATION);

        return Ok(locationConfig);
    }
}

