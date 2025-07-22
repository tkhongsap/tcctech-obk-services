using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
using TCCT.ServiceAbstraction.Domain;
using System.Text.Json;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchFacilitiesQuery;

public class ReservationSearchFacilitiesQueryHandler : IQueryHandler<ReservationSearchFacilitiesQuery, List<ReservationSearchFacilitiesQueryResult>>
{
    private readonly IFinedayResidenceService _service;
    public ReservationSearchFacilitiesQueryHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<ReservationSearchFacilitiesQueryResult>> Handle(ReservationSearchFacilitiesQuery request, CancellationToken cancellationToken)
    {
        return await _service.ReservationSearchFacilitiesQuery(request);
    }
}
