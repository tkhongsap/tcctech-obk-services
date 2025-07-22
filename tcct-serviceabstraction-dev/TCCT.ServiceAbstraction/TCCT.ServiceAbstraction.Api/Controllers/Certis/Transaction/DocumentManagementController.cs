using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKey;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyDefault;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;


namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class DocumentManagementController : ControllerBase
{
	private readonly IMediator _mediator;
	public DocumentManagementController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("DMS")]
	[SwaggerOperation(Summary = "Document Management")]
	[ProducesResponseType(typeof(DocumentManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DMS([FromForm] DocumentManagementRequest body)
	{
		var command = new DocumentManagementCommand(body);
		var res = await _mediator.Send(command);
		return Ok(res);
	}

	[HttpGet("DMS/Documents/{objectType}/hidden")]
	[SwaggerOperation(Summary = "Get Documents file with id")]
	[ProducesResponseType(typeof(List<DmsByObjectTypeHiddenResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDmsByObjectTypeAndKeyHidden(string objectType)
	{
		var query = new DmsByObjectTypeHiddenQuery(objectType);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("DMS/Documents/{objectType}/{objectKey}/hidden")]
	[SwaggerOperation(Summary = "Get Documents file with id")]
	[ProducesResponseType(typeof(List<DmsByObjectTypeAndKeyHiddenResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDmsByObjectTypeAndKeyHidden(string objectType, int objectKey)
	{
		var query = new DmsByObjectTypeAndKeyHiddenQuery(objectType, objectKey);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("DMS/Documents/{ot}/{ok}/defult")]
	[SwaggerOperation(Summary = "Get Documents file with id")]
	[ProducesResponseType(typeof(List<DmsByObjectTypeAndKeyDefaultResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDmsByObjectTypeAndKeyDefault(string ot, string ok)
	{
		var query = new DmsByObjectTypeAndKeyDefaultQuery(ot, ok);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("DMS/Documents/{ot}/{ok}")]
	[SwaggerOperation(Summary = "Get Documents file with id")]
	[ProducesResponseType(typeof(List<DmsByObjectTypeAndKeyResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDmsByObjectTypeAndKey(string ot, string ok)
	{
		var query = new DmsByObjectTypeAndKeyQuery(ot, ok);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("DMS/Documents/image/{id}")]
	[SwaggerOperation(Summary = "Get image file with id")]
	[ProducesResponseType(typeof(FileContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<FileContentResult> GetDmsImageById(int id)
	{
		var query = new DmsImageByIdQuery(id);
		var res = await _mediator.Send(query);
		return File(res.Image, "image/png");
	}

	[HttpGet("DMS/Documents/detail/{id}")]
	[SwaggerOperation(Summary = "Get detail file with id")]
	[ProducesResponseType(typeof(DmsDetailByIdResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDmsDetailById(int id)
	{
		var query = new DmsDetailByIdQuery(id);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}
