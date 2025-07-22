using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Minio.DataModel;
using Refit;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Api.Service;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Command.UploadHomeContent;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Command.Banner;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Query.GetBanner;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ChangeOrder.Command.ChangeOrder;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.Config.Command.Config;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.ContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.DeleteContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DeleteContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DeleteLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.DeletePRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api;

[Route("api/v1/Sustainability")]
[ApiController]
[ApiExplorerSettings(GroupName = "sustainabilityv1")]
public class SustainabilityController : ControllerBase
{
	private readonly ISustainability _sustainability;
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public SustainabilityController(ISustainability sustainability, IMediator mediator, IAuditableService auditableService)
	{
		_sustainability = sustainability;
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpPost("upload")]
	[SwaggerOperation(Summary = "upload")]
	[ProducesResponseType(typeof(Upload), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Upload(UploadHomeContentCommand command)
	{
		var result = await _sustainability.upload(command);
		return StatusCode(result.nStatusCode, result);
	}

	[HttpPost("Banner/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(BannerResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> Publish(BannerCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		BannerResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("GetBanner")]
	[SwaggerOperation(Summary = "Get All Banner")]
	[ProducesResponseType(typeof(Upload), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetBanner()
	{
		GetBannerQuery query = new GetBannerQuery();
		GetBannerResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("DigitalLibrary/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeleteLibraryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DigitalLibraryDelete(DeleteLibraryCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		DeleteLibraryResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("DigitalLibrary/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(DigitalLibraryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DigitalLibraryPublish(DigitalLibraryCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		DigitalLibraryResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("DigitalLibrary/{id}")]
	[SwaggerOperation(Summary = "Get Digital Library")]
	[ProducesResponseType(typeof(GetDigitalLibraryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDigitalLibraryById(Guid id)
	{
		GetDigitalLibraryQuery query = new GetDigitalLibraryQuery(id);
		GetDigitalLibraryResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("DigitalLibrary")]
	[SwaggerOperation(Summary = "Get Digital Library List")]
	[ProducesResponseType(typeof(GetAllDigitalLibraryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetDigitalLibrary([FromQuery] GetAllDigitalLibraryQuery query)
	{
		GetAllDigitalLibraryResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("ContentManagement/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeleteContentManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ContentManagementDelete(DeleteContentManagementCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		DeleteContentManagementResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("ContentManagement/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(ContentManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ContentManagementPublish(ContentManagementCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}
		

		ContentManagementResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("ContentManagement/{id}")]
	[SwaggerOperation(Summary = "Get Content Management")]
	[ProducesResponseType(typeof(GetContentManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCMSById(Guid id)
	{
		GetContentManagementQuery query = new GetContentManagementQuery(id);
		GetContentManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("ContentManagement")]
	[SwaggerOperation(Summary = "Get Content Management List")]
	[ProducesResponseType(typeof(GetAllContentManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetContentManagement([FromQuery] GetAllContentManagementQuery query)
	{
		GetAllContentManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Sustainability/ChangeOrder")]
	[SwaggerOperation(Summary = "Change Order")]
	[ProducesResponseType(typeof(ChangeOrderResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ChangeOrder(ChangeOrderCommand command)
	{
		ChangeOrderResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}
	[HttpPost("PRBannerManagement/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeletePRBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PRBannerDelete(DeletePRBannerManagementCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		DeletePRBannerManagementResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("PRBannerManagement/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(PRBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PRBannerPublish(PRBannerManagementCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = _auditableService.MID;
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = _auditableService.MID;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		PRBannerManagementResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("PRBannerManagement/{id}")]
	[SwaggerOperation(Summary = "Get PR Banner Management")]
	[ProducesResponseType(typeof(GetPRBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPRBannerById(Guid id)
	{
		GetPRBannerManagementQuery query = new GetPRBannerManagementQuery(id);
		GetPRBannerManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("PRBannerManagement")]
	[SwaggerOperation(Summary = "Get PR Banner Management List")]
	[ProducesResponseType(typeof(GetAllPRBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPRBannerManagement([FromQuery] GetAllPRBannerManagementQuery query)
	{
		GetAllPRBannerManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("ContentManagement/MainMenu")]
	[SwaggerOperation(Summary = "Get Main Menu Option List")]
	[ProducesResponseType(typeof(MainContentManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCMSMenu([FromQuery] MainContentManagementQuery query)
	{
		MainContentManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("PRBannerManagement/GetInitial")]
	[SwaggerOperation(Summary = "Get Initial Data")]
	[ProducesResponseType(typeof(GetInitialPRBannerResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetInitialBanner([FromQuery] InitialPRBannerQuery query)
	{
		GetInitialPRBannerResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Sustainability/SaveConfig")]
	[SwaggerOperation(Summary = "Save Config")]
	[ProducesResponseType(typeof(ConfigResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SaveConfig(ConfigCommand command)
	{
		ConfigResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}
}
