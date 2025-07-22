using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.AirQuality;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetActiveFloor;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedAll;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedCO2;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM10;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM25;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedTemperature;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetOutdoorZone;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetSimpleFeedAll;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.Humidity;

namespace TCCT.ServiceAbstraction.Api.Controllers.AirQuality;

[ApiController]
[Route("api/v1/airquality")]
[ApiExplorerSettings(GroupName = "airqualityv1")]
public class AirQualityController : ControllerBase
{
	private readonly IMediator _mediator;
	public AirQualityController(IMediator mediator)
	{
		_mediator = mediator;
	}

	[HttpGet("activefloor")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(List<string>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetActiveFloor(string building)
	{
		var query = new GetActiveFloorQuery(building);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("outdoorzone")]
	[SwaggerOperation(Summary = "")]
	[ProducesResponseType(typeof(List<GetOutdoorZoneResponse>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetOutdoorZone()
	{
		var query = new GetOutdoorZoneQuery();
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("simplefeed")]
	[SwaggerOperation(Summary = "Air quality data feed for all sensor types in simple data format")]
	[ProducesResponseType(typeof(List<GetSimpleFeedAllResponse>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetSimpleFeedAll(string building, string? floor, string? status)
	{
		var query = new GetSimpleFeedAllQuery(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("feed")]
	[SwaggerOperation(Summary = "Air quality data feed for all sensor types")]
	[ProducesResponseType(typeof(List<GetCalculatedResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedAll(string building, string? floor, string? status)
	{
		var query = new GetFeedAllQuery(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("feed/pm25")]
	[SwaggerOperation(Summary = "Air quality data feed for PM2.5")]
	[ProducesResponseType(typeof(List<GetCalculatedResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedPM25(string building, string? floor, string? status)
	{
		var query = new GetFeedPM25Query(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("feed/pm10")]
	[SwaggerOperation(Summary = "Air quality data feed for PM10")]
	[ProducesResponseType(typeof(List<GetCalculatedResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedPM10(string building, string? floor, string? status)
	{
		var query = new GetFeedPM10Query(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("feed/co2")]
	[SwaggerOperation(Summary = "Air quality data feed for CO2")]
	[ProducesResponseType(typeof(List<GetCalculatedResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedCO2(string building, string? floor, string? status)
	{
		var query = new GetFeedCO2Query(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("feed/temperature")]
	[SwaggerOperation(Summary = "Air quality data feed for temperature")]
	[ProducesResponseType(typeof(List<GetCalculatedResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedTemperature(string building, string? floor, string? status)
	{
		var query = new GetFeedTemperatureQuery(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

	[HttpGet("feed/humidity")]
	[SwaggerOperation(Summary = "Air quality data feed for humidity")]
	[ProducesResponseType(typeof(List<GetCalculatedResult>), (int)HttpStatusCode.OK)]
	[ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
	[ProducesResponseType(typeof(void), (int)HttpStatusCode.Unauthorized)]
	public async Task<IActionResult> GetFeedHumidity(string building, string? floor, string? status)
	{
		var query = new GetFeedHumidityQuery(building, floor, status);
		var res = await _mediator.Send(query);
		return Ok(res);
	}

}
