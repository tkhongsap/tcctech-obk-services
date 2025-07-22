using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchQuery;

public class ReservationSearchQueryHandler : IQueryHandler<ReservationSearchQuery, List<ReservationSearchQueryResult>>
{
    private readonly IFinedayResidenceService _service;
    public ReservationSearchQueryHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<ReservationSearchQueryResult>> Handle(ReservationSearchQuery request, CancellationToken cancellationToken)
	{
		return await _service.ReservationSearchQuery(request);
	}
}
