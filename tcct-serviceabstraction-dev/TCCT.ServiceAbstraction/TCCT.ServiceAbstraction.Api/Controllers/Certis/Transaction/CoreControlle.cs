using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetFunctionRoles;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.UpdateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;

namespace TCCT.ServiceAbstraction.Api.Controllers.Certis.Transaction;
[Route("api/v1/certis/cms/core")]
[ApiController]
[ApiExplorerSettings(GroupName = "certistransactionv1")]
public class CoreController : ControllerBase
{
	private readonly IMediator _mediator;
	public CoreController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpPost("staff")]
	[SwaggerOperation(Summary = "Create Staff")]
	[ProducesResponseType(typeof(CreateStaffResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> CreateStaff([FromBody] CreateStaffCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("locations/{locationId}/staffs")]
	[SwaggerOperation(Summary = "Get Staffs by building")]
	[ProducesResponseType(typeof(List<GetStaffByBuildingResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetStaffByBuilding(string locationId, [FromQuery(Name = "frids")] string? frids, [FromQuery(Name = "online")] int? online)
	{
		var query = new GetStaffByBuildingQuery(locationId, frids, online);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("staffs/{staffCodeOrId}/functionroles")]
	[SwaggerOperation(Summary = "Get Staffs by building")]
	[ProducesResponseType(typeof(List<GetStaffRoleMappingResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetStaffRoleMapping(string staffCodeOrId)
	{
		var query = new GetStaffRoleMappingQuery(staffCodeOrId);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpPost("staffs/functionroles")]
	[SwaggerOperation(Summary = "Add Staff Role Mapping")]
	[ProducesResponseType(typeof(AddStaffRoleMappingResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> AddStaffRoleMapping([FromBody] AddStaffRoleMappingCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpPut("staff")]
	[SwaggerOperation(Summary = "Update Staff")]
	[ProducesResponseType(typeof(UpdateStaffResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> UpdateStaff([FromBody] UpdateStaffCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpDelete("staffs/functionroles")]
	[SwaggerOperation(Summary = "Delete Staff Role Mapping")]
	[ProducesResponseType(typeof(DeleteStaffRoleMappingResult), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> DeleteStaffRoleMapping([FromBody] DeleteStaffRoleMappingCommand body)
	{
		var res = await _mediator.Send(body);
		return Ok(res);
	}

	[HttpGet("functionroles")]
	[SwaggerOperation(Summary = "Get Function Roles")]
	[ProducesResponseType(typeof(List<GetFunctionRolesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFunctionRoles()
	{
		var query = new GetFunctionRolesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("staffs/search")]
	[SwaggerOperation(Summary = "Get Staffs by search")]
	[ProducesResponseType(typeof(List<GetStaffSearchResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetStaffSearch([FromQuery(Name = "search")] string? search)
	{
		var query = new GetStaffSearchQuery(search);
		var res = await _mediator.Send(query);
		return Ok(res);
	}
}