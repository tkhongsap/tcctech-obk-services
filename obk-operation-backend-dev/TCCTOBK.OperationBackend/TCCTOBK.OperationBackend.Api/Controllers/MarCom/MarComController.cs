using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Config.Command.Config;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Command.DeleteExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Command.Explore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetAllExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Command.DeleteHappening;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Command.Happening;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllCategory;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllContent;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Command.DeleteSpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Command.SpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetAll;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ChangeOrder.Command.ChangeOrder;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.Config.Command.Config;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.DeletePRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Api;

[Route("api/v1/Marcom")]
[ApiController]
[ApiExplorerSettings(GroupName = "marcomv1")]
public class MarcomController : ControllerBase
{
	private readonly IMediator _mediator;
	private readonly IAuditableService _auditableService;
	public MarcomController(IMediator mediator, IAuditableService auditableService)
	{
		_mediator = mediator;
		_auditableService = auditableService;
	}

	[HttpPost("MarcomBanner/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(MarcomBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> BannerPublish(MarcomBannerManagementCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = Guid.NewGuid();
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = command.CreatedBy;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		MarcomBannerManagementResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("MarcomBanner/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeleteMarcomBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> PRBannerDelete(DeleteMarcomBannerManagementCommand command)
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

		DeleteMarcomBannerManagementResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("MarcomBanner/{id}")]
	[SwaggerOperation(Summary = "Get PR Banner Management")]
	[ProducesResponseType(typeof(GetMarcomBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPRBannerById(Guid id)
	{
		GetMarcomBannerManagementQuery query = new GetMarcomBannerManagementQuery(id);
		GetMarcomBannerManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("MarcomBanner")]
	[SwaggerOperation(Summary = "Get PR Banner Management List")]
	[ProducesResponseType(typeof(GetAllMarcomBannerManagementResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetPRBannerManagement([FromQuery] GetAllMarcomBannerManagementQuery query)
	{
		GetAllMarcomBannerManagementResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("PRBannerManagement/GetInitial")]
	[SwaggerOperation(Summary = "Get Initial Data")]
	[ProducesResponseType(typeof(GetInitialMarcomBannerResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetInitialBanner([FromQuery] InitialMarcomBannerQuery query)
	{
		GetInitialMarcomBannerResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}
	[HttpPost("Marcom/ChangeOrder")]
	[SwaggerOperation(Summary = "Change Order")]
	[ProducesResponseType(typeof(ChangeOrderMarcomResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ChangeOrder(ChangeOrderMarcomCommand command)
	{
		ChangeOrderMarcomResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Event/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(UpdateEventResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> EventPublish(UpdateEventCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = Guid.NewGuid();
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = command.CreatedBy;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		UpdateEventResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Event/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeleteEventResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> EventDelete(DeleteEventCommand command)
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

		DeleteEventResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Event/{id}")]
	[SwaggerOperation(Summary = "Get Event")]
	[ProducesResponseType(typeof(GetEventResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetEventById(Guid id)
	{
		GetEventQuery query = new GetEventQuery(id);
		GetEventResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Event")]
	[SwaggerOperation(Summary = "Get Event List")]
	[ProducesResponseType(typeof(GetAllEventResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetEvent([FromQuery] GetAllEventQuery query)
	{
		GetAllEventResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Explore/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(UpdateExploreResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ExplorePublish(UpdateExploreCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = Guid.NewGuid();
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = command.CreatedBy;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		UpdateExploreResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Explore")]
	[SwaggerOperation(Summary = "Get Event List")]
	[ProducesResponseType(typeof(GetAllExploreResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetExplore([FromQuery] GetAllExploreQuery query)
	{
		GetAllExploreResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Explore/{id}")]
	[SwaggerOperation(Summary = "Get Explore")]
	[ProducesResponseType(typeof(GetExploreResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetExploreById(Guid id)
	{
		GetExploreQuery query = new GetExploreQuery(id);
		GetExploreResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Explore/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeleteExploreResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> ExploreDelete(DeleteExploreCommand command)
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

		DeleteExploreResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Happening/Publish")]
	[SwaggerOperation(Summary = "Publish")]
	[ProducesResponseType(typeof(UpdateHappeningResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> HappeningPublish(UpdateHappeningCommand command)
	{
		try
		{
			command.CreatedDate = _auditableService.TimeStamp;
			command.CreatedBy = Guid.NewGuid();
			command.CreatedByName = _auditableService.MemberName;
			command.UpdatedDate = _auditableService.TimeStamp;
			command.UpdatedBy = command.CreatedBy;
			command.UpdatedByName = _auditableService.MemberName;
		}
		catch (Exception)
		{
			throw new BadRequestException("Please login again.");
		}

		UpdateHappeningResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Category")]
	[SwaggerOperation(Summary = "Get Category List")]
	[ProducesResponseType(typeof(GetAllCategoryResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCategory([FromQuery] GetAllCategoryQuery query)
	{
		GetAllCategoryResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Happening/{id}")]
	[SwaggerOperation(Summary = "Get Happening")]
	[ProducesResponseType(typeof(GetHappeningResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetHappeningById(Guid id)
	{
		GetHappeningQuery query = new GetHappeningQuery(id);
		GetHappeningResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpGet("Content")]
	[SwaggerOperation(Summary = "Get Content List")]
	[ProducesResponseType(typeof(GetAllContentResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetContent([FromQuery] GetAllContentQuery query)
	{
		GetAllContentResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}
	[HttpGet("Happening/Category")]
	[SwaggerOperation(Summary = "Get Category Option List")]
	[ProducesResponseType(typeof(CategoryListResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetCategoryList([FromQuery] CategoryListQuery query)
	{
		CategoryListResult result = await _mediator.Send(query);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Happening/Delete")]
	[SwaggerOperation(Summary = "Delete")]
	[ProducesResponseType(typeof(DeleteHappeningResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> HappeningDelete(DeleteHappeningCommand command)
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

		DeleteHappeningResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}

	[HttpPost("Marcom/SaveConfig")]
	[SwaggerOperation(Summary = "Save Config")]
	[ProducesResponseType(typeof(ConfigMarcomResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> SaveConfig(ConfigMarcomCommand command)
	{
		ConfigMarcomResult result = await _mediator.Send(command);
		return StatusCode(result.StatusCode, result);
	}
}
