using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Controllers;
using TCCTOBK.OperationBackend.Api.Middleware;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Document.Command.UploadVideo;

namespace TCCTOBK.OperationBackend.Api;

[ApiController]
[Route("api/v1/operation/mobile/document")]
[ApiExplorerSettings(GroupName = "operationmobilev1")]
[MiddlewareFilter(typeof(ClientSiteMiddlewarePipeline))]
public class DocumentController : OperationApiControllerBase
{
  private readonly IMediator _mediator;

  public DocumentController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpPost("Upload")]
  [SwaggerOperation(Summary = "Upload file to certis")]
  [ProducesResponseType(typeof(DocumentCertisResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult<DocumentCertisResult>> Upload([FromForm] UploadDocumentCommand command)
  {
    var res = await _mediator.Send(command);
    return Ok(res);
  }

  [HttpPost("Upload/Video")]
  [SwaggerOperation(Summary = "Upload video to certis")]
  [ProducesResponseType(typeof(DocumentCertisResult), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult<DocumentCertisResult>> UploadVideo([FromForm] UploadVideoCommand command)
  {
    var res = await _mediator.Send(command);
    return Ok(res);
  }

  [HttpGet("GetFiles/{objectType}")]
  [SwaggerOperation(Summary = "Upload file to certis")]
  [ProducesResponseType(typeof(List<DocumentCertisResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult<List<DocumentCertisResult>>> GetFiles(string objectType)
  {
    var query = new GetDocumentFilesQuery(objectType);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("GetFiles/{objectType}/{objectKey}")]
  [SwaggerOperation(Summary = "Upload file to certis")]
  [ProducesResponseType(typeof(List<DocumentCertisResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult<List<DocumentCertisResult>>> GetFilesByObjectKey(string objectType, string objectKey)
  {
    var query = new GetDocumentFilesQuery(objectType, objectKey);
    var res = await _mediator.Send(query);
    return Ok(res);
  }

  [HttpGet("GetImage/{id}")]
  [SwaggerOperation(Summary = "Upload file to certis")]
  [ProducesResponseType(typeof(List<DocumentCertisResult>), (int)HttpStatusCode.OK)]
  [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
  [ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
  public async Task<ActionResult<List<DocumentCertisResult>>> GetImage(string id)
  {
    var query = new GetDocumentImageQuery(id);
    var res = await _mediator.Send(query);
    return File(res.ByteArray, res.ContentType);
  }

}
