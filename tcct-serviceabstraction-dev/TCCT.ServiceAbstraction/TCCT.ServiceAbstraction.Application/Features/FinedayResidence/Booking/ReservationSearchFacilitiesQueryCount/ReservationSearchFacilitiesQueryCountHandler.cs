using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchFacilitiesQuery;
using System.Text.Json;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchFacilitiesQuery;

public class ReservationSearchFacilitiesQueryCountHandler : IQueryHandler<ReservationSearchFacilitiesQueryCount, ReservationSearchFacilitiesQueryCountResult>
{
    private readonly IFinedayResidenceService _service;
    public ReservationSearchFacilitiesQueryCountHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<ReservationSearchFacilitiesQueryCountResult> Handle(ReservationSearchFacilitiesQueryCount request, CancellationToken cancellationToken)
    {
        var requestData = new ReservationSearchFacilitiesQuery(request.Title, request.Facilities, request.Start, request.End, request.Status, request.Organizer, request.Hasdetails, request.Page, request.Perpage, request.History, request.ResidenceId);
        var response = await _service.ReservationSearchFacilitiesQueryCount(requestData);
    
        return new ReservationSearchFacilitiesQueryCountResult() {
            Total = response ?? 0
        };
    }
}
