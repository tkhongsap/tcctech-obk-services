using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationFacilitiesByID;

public class GetReservationFacilitiesByIDHandler : IQueryHandler<GetReservationFacilitiesByIDQuery, GetReservationFacilitiesByIDResult>
{
    private readonly IFinedayResidenceService _service;
    public GetReservationFacilitiesByIDHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<GetReservationFacilitiesByIDResult> Handle(GetReservationFacilitiesByIDQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetReservationFacilitiesByID(request.Id);
	}
}
