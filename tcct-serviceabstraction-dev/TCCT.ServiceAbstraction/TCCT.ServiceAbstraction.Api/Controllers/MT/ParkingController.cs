using System.Net;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingSpace;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetTrafficStatusRecord;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingQuery;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParking;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParkingStations;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PatchCallMyValetCar;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingDetailByPersonId;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlocker;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlockerList;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.UpdateTransactionCarpark;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.EntCarpark;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.ExtCarpark;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/mt/parking")]
[ApiExplorerSettings(GroupName = "mtv1")]
public class ParkingController : ControllerBase
{
    private readonly IMediator _mediator;
    public ParkingController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost("spaceNo")]
    [SwaggerOperation(Summary = "Get parking lots")]
    [ProducesResponseType(typeof(List<GetParkingSpaceResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetParkingSpace([FromBody] GetParkingSpaceCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("trafficStatusRecord")]
    [SwaggerOperation(Summary = "Get Traffic Jam")]
    [ProducesResponseType(typeof(GetTrafficStatusRecordResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetTrafficStatusRecord([FromBody] GetTrafficStatusRecordCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("query")]
    [SwaggerOperation(Summary = "Find My Car")]
    [ProducesResponseType(typeof(GetParkingQueryResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetParkingQuery([FromBody] GetParkingQueryCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpGet("valetParking/{uid}")]
    [SwaggerOperation(Summary = "Get Valet Parking by Qr Code")]
    [ProducesResponseType(typeof(GetValetParkingResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetValetParking(string uid, [FromQuery(Name = "page")] int? page, [FromQuery(Name = "limit")] int? limit, [FromQuery(Name = "sort")] string? sort, [FromQuery(Name = "reverse")] bool? reverse, [FromQuery(Name = "query")] string? query)
    {
        var req = new GetValetParkingQuery(uid, query, limit, page, sort, reverse);
        var res = await _mediator.Send(req);
        return Ok(res);
    }

    [HttpGet("valetParkingStations")]
    [SwaggerOperation(Summary = "Get Valet Parking Stations")]
    [ProducesResponseType(typeof(List<GetValetParkingStationsResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetValetParkingStations()
    {
		var query = new GetValetParkingStationsQuery();
        var res = await _mediator.Send(query);
        return Ok(res);
    }

    [HttpPatch("callValetCar")]
    [SwaggerOperation(Summary = "Call My Valet Car")]
    [ProducesResponseType(typeof(PatchCallMyValetCarResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> PatchCallMyValetCar([FromBody] PatchCallMyValetCarCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("getParkingDetailByPersonId")]
    [SwaggerOperation(Summary = "Get Parking Detail By PersonId")]
    [ProducesResponseType(typeof(GetParkingDetailByPersonIdResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetParkingDetailByPersonId([FromBody] GetParkingDetailByPersonIdCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("pmsCarBlocker")]
    [SwaggerOperation(Summary = "Block a car in the parking system")]
    [ProducesResponseType(typeof(List<PmsCarBlockerResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> PmsCarBlockerList()
    {
        var request = new PmsCarBlockerListCommand();
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    
    [HttpPost("pmsCarBlocker/byDeviceId")]
    [SwaggerOperation(Summary = "Block a car in the parking system")]
    [ProducesResponseType(typeof(PmsCarBlockerResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> PmsCarBlocker([FromBody] PmsCarBlockerCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("carpark/updateTransaction")]
    [SwaggerOperation(Summary = "Update Transaction Carpark")]
    [ProducesResponseType(typeof(UpdateTransactionCarparkResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> UpdateTransactionCarpark([FromBody] UpdateTransactionCarparkCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }

    [HttpPost("carpark/entCarpark")]
    [SwaggerOperation(Summary = "Update EntCarpark")]
    [ProducesResponseType(typeof(EntCarparkResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> EntCarpark([FromBody] EntCarparkCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
    [HttpPost("carpark/extCarpark")]
    [SwaggerOperation(Summary = "Update ExtCarpark")]
    [ProducesResponseType(typeof(ExtCarparkResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ExtCarpark([FromBody] ExtCarparkCommand request)
    {
        var res = await _mediator.Send(request);
        return Ok(res);
    }
}