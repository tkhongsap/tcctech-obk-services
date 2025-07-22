using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationByID;

public class GetReservationByIDHandler : IQueryHandler<GetReservationByIDQuery, GetReservationByIDResult>
{
    private readonly IFinedayResidenceService _service;
    public GetReservationByIDHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<GetReservationByIDResult> Handle(GetReservationByIDQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetReservationByID(request.Id);
	}
}
