using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetGroup;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;

namespace TCCT.ServiceAbstraction.Api.Certis.Controllers.MasterData;

[Route("api/v1/certis")]
[ApiController]
[ApiExplorerSettings(GroupName = "certismasterv1")]
public class AssetManagementController : ControllerBase
{
	private readonly IMediator _mediator;
	public AssetManagementController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("Assets/Categories")]
	[SwaggerOperation(Summary = "Get AssetCategories")]
	[ProducesResponseType(typeof(List<AssetCategoriesResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAssetCategories()
	{
		var query = new AssetCategoriesQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Assets/Group")]
	[SwaggerOperation(Summary = "Get Assetgroups")]
	[ProducesResponseType(typeof(List<AssetGroupResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAssetGroup()
	{
		var query = new AssetGroupQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("Assets")]
	[SwaggerOperation(Summary = "Get Assets")]
	[ProducesResponseType(typeof(List<AssetResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetAsset()
	{
		var query = new AssetQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

}
