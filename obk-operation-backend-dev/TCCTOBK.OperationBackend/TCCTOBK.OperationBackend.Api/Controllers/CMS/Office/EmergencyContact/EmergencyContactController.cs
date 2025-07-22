using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Command.PublishEmergency;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Query.GetEmergency;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.Office.EmergencyContact;

[Route("api/v1/EmergencyContact")]
[ApiController]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class EmergencyContactController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IAuditableService _auditableService;
    public EmergencyContactController(IMediator mediator, IAuditableService auditableService)
    {
        _mediator = mediator;
        _auditableService = auditableService;
    }

    [HttpGet("")]
    [SwaggerOperation(Summary = "Get Emergency")]
    [ProducesResponseType(typeof(GetEmergencyResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> Get()
    {
        var query = new GetEmergencyQuery();
        var res = await _mediator.Send(query);
        return Ok(res);
    }
    [HttpPut("")]
    [SwaggerOperation(Summary = "Publish Emergency Contact")]
    [ProducesResponseType(typeof(PublishEmergencyResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> Create([FromBody] PublishEmergencyCommand request)
    {
        request.UpdatedDate = _auditableService.TimeStamp;
        request.UpdatedBy = _auditableService.MID;
        request.UpdatedByName = _auditableService.MemberName;
        var res = await _mediator.Send(request);
        return Ok(res);
    }
}
