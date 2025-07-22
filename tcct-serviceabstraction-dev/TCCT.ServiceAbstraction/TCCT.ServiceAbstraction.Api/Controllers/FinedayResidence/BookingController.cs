using System.Net;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TCCT.ServiceAbstraction.Application.Features;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetFacilities;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchQuery;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationCreate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationByID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationUpdate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Facilities;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesUpdate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesCreate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationFacilitiesByID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchFacilitiesQuery;

namespace TCCT.ServiceAbstraction.Api.Controllers.FinedayResidence;

[ApiController]
[Route("api/v1/fineday/booking")]
[ApiExplorerSettings(GroupName = "finedayresidencev1")]
public class BookingController : ControllerBase
{
    private readonly IMediator _mediator;
    public BookingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("reservation/search/query")]
    [SwaggerOperation(Summary = "Reservation Search Query")]
    [ProducesResponseType(typeof(List<ReservationSearchQueryResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationSearchQuery([FromQuery] string? title, [FromQuery] string? facilities, [FromQuery] string start, [FromQuery] string end, [FromQuery] string? status, [FromQuery] string? organizer, [FromQuery] bool? hasdetails)
    {
        var request = new ReservationSearchQuery(title, facilities, start, end, status, organizer, hasdetails);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpGet("reservation/getReservationByID/{id}")]
    [SwaggerOperation(Summary = "Get Reservation Details by Reservation ID")]
    [ProducesResponseType(typeof(GetReservationByIDResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetReservationByID(string id)
    {
        var request = new GetReservationByIDQuery(id);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpPost("reservation/create")]
    [SwaggerOperation(Summary = "Reservation Create")]
    [ProducesResponseType(typeof(ReservationCreateResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationCreate([FromBody] ReservationCreateCommand request)
    {
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpPatch("reservation/update")]
    [SwaggerOperation(Summary = "Reservation Update")]
    [ProducesResponseType(typeof(ReservationUpdateResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationUpdate([FromBody] ReservationUpdateCommand request)
    {
        var res = await _mediator.Send(request);

        return Ok(res);
    }

    [HttpGet("reservation/getFacilities")]
    [SwaggerOperation(Summary = "Get Facilities")]
    [ProducesResponseType(typeof(GetFacilitiesResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetFacilities([FromQuery] string page, [FromQuery] string limit, [FromQuery] string types)
    {
        var request = new GetFacilitiesQuery(page, limit, types);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpGet("reservation/facilities")]
    [SwaggerOperation(Summary = "Get Facilities v.2")]
    [ProducesResponseType(typeof(GetFacilitiesResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> Facilities([FromQuery] string page, [FromQuery] string limit, [FromQuery] string types, [FromQuery] string? tower, [FromQuery] int? residenceId)
    {
        var request = new FacilitiesQuery(page, limit, types, tower, residenceId);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpPost("reservation/facilities/create")]
    [SwaggerOperation(Summary = "Reservation Create v.2")]
    [ProducesResponseType(typeof(ReservationFacilitiesCreateResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationFacilitiesCreate([FromBody] ReservationFacilitiesCreateCommand request)
    {
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpPatch("reservation/facilities/update")]
    [SwaggerOperation(Summary = "Reservation Update v.2")]
    [ProducesResponseType(typeof(ReservationFacilitiesUpdateResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationFacilitiesUpdate([FromBody] ReservationFacilitiesUpdateCommand request)
    {
        var res = await _mediator.Send(request);

        return Ok(res);
    }

    [HttpGet("reservation/search/facilities")]
    [SwaggerOperation(Summary = "Reservation Search Query v.2")]
    [ProducesResponseType(typeof(List<ReservationSearchFacilitiesQueryResult>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationSearchFacilitiesQuery([FromQuery] string? title, [FromQuery] string? facilities, [FromQuery] string start, [FromQuery] string end, [FromQuery] string? status, [FromQuery] string? organizer, [FromQuery] bool? hasdetails, [FromQuery] int? page, [FromQuery] int? perpage, [FromQuery] bool? history, [FromQuery] int? residenceId)
    {
        var request = new ReservationSearchFacilitiesQuery(title, facilities, start, end, status, organizer, hasdetails, page, perpage, history, residenceId);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

     [HttpGet("reservation/search/facilities/count")]
    [SwaggerOperation(Summary = "Reservation Count Search Query v.2")]
    [ProducesResponseType(typeof(ReservationSearchFacilitiesQueryCountResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ReservationSearchFacilitiesQueryCount([FromQuery] string? title, [FromQuery] string? facilities, [FromQuery] string start, [FromQuery] string end, [FromQuery] string? status, [FromQuery] string? organizer, [FromQuery] bool? hasdetails, [FromQuery] int? page, [FromQuery] int? perpage, [FromQuery] bool? history, [FromQuery] int? residenceId)
    {
        var request = new ReservationSearchFacilitiesQueryCount(title, facilities, start, end, status, organizer, hasdetails, page, perpage, history, residenceId);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }

    [HttpGet("reservation/facilities/{id}")]
    [SwaggerOperation(Summary = "Get Reservation Details by Reservation ID v.2")]
    [ProducesResponseType(typeof(GetReservationFacilitiesByIDResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.InternalServerError)]
    [ProducesResponseType(typeof(FailedResult), (int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> GetReservationFacilitiesByID(string id)
    {
        var request = new GetReservationFacilitiesByIDQuery(id);
        var res = await _mediator.Send(request);
        
        return Ok(res);
    }
}
