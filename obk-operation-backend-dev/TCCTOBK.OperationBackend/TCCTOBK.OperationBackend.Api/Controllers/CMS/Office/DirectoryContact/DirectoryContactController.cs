using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.CreateDirectoryContact;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteCategoryDirectoryContact;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteDirectoryContact;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.EditNumber;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.UpdateDirectoryContact;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactById;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContacts;
using TCCTOBK.OperationBackend.Application.Helper.Service;


namespace TCCTOBK.OperationBackend.Api.Controllers.CMS.Office.DirectoryContact;

[Route("api/v1/DirectoryContact")]
[ApiController]
[ApiExplorerSettings(GroupName = "cmsv1")]
public class DirectoryContactController : ControllerBase
{
  private readonly IMediator _mediator;
  private readonly IAuditableService _auditableService;
  public DirectoryContactController(IMediator mediator, IAuditableService auditableService)
  {
    _mediator = mediator;
    _auditableService = auditableService;
  }
  [HttpGet("")]
  [SwaggerOperation(Summary = "Get List Directory Contact")]
  [ProducesResponseType(typeof(GetDirectoryContactCategoryResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetList([FromQuery] Guid? categoryId)
  {
    var query = new GetDirectoryContactCategoryQuery(categoryId);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("List")]
  [SwaggerOperation(Summary = "Get List Directory Contact")]
  [ProducesResponseType(typeof(GetDirectoryContactCategoryResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetDirectoryContacts([FromQuery] GetDirectoryContactsQuery query)
  {
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("{id}")]
  [SwaggerOperation(Summary = "Get Contact Directory Contact")]
  [ProducesResponseType(typeof(GetDirectoryContactByIdResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> GetById(Guid id)
  {
    var query = new GetDirectoryContactByIdQuery(id);
    var res = await _mediator.Send(query);
    return Ok(res);
  }
  [HttpPost("Category")]
  [SwaggerOperation(Summary = "Create Category Directory Contact")]
  [ProducesResponseType(typeof(CreateDirectoryContactResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> CreateCategory([FromBody] CreateDirectoryContactCommand req)
  {
    req.CreatedDate = _auditableService.TimeStamp;
    req.CreatedBy = _auditableService.MID;
    req.CreatedByName = _auditableService.MemberName;
    req.UpdatedDate = _auditableService.TimeStamp;
    req.UpdatedBy = _auditableService.MID;
    req.UpdatedByName = _auditableService.MemberName;
    var res = await _mediator.Send(req);
    return Ok(res);
  }
  [HttpPut("Category")]
  [SwaggerOperation(Summary = "Update Category Directory Contact")]
  [ProducesResponseType(typeof(UpdateDirectoryContactResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> UpdateCategory([FromBody] UpdateDirectoryContactCommand req)
  {
    req.UpdatedDate = _auditableService.TimeStamp;
    req.UpdatedBy = _auditableService.MID;
    req.UpdatedByName = _auditableService.MemberName;
    var res = await _mediator.Send(req);
    return Ok(res);
  }
  [HttpDelete("category/{id}")]
  [SwaggerOperation(Summary = "Delete Category Directory Contact")]
  [ProducesResponseType(typeof(DeleteCategoryDirectoryContactResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> DeleteCategory(Guid id)
  {
    var command = new DeleteCategoryDirectoryContactCommand(id);
    var res = await _mediator.Send(command);
    return Ok(res);
  }
  [HttpDelete("")]
  [SwaggerOperation(Summary = "Delete Directory Contact")]
  [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> DeleteDirectoryContact([FromBody] DeleteDirectoryContactCommand req)
  {
    var res = await _mediator.Send(req);
    return Ok(res);
  }
  [HttpPut("Number")]
  [SwaggerOperation(Summary = "Edit Number")]
  [ProducesResponseType(typeof(EditNumberResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<IActionResult> EditNumber([FromBody] EditNumberCommand req)
  {
    req.UpdatedDate = _auditableService.TimeStamp;
    req.UpdatedBy = _auditableService.MID;
    req.UpdatedByName = _auditableService.MemberName;
    var res = await _mediator.Send(req);
    return Ok(res);
  }


}

