using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesUpdate;

public class ReservationFacilitiesUpdateHandler : ICommandHandler<ReservationFacilitiesUpdateCommand, ReservationFacilitiesUpdateResult>
{
    private readonly IFinedayResidenceService _service;
    public ReservationFacilitiesUpdateHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<ReservationFacilitiesUpdateResult> Handle(ReservationFacilitiesUpdateCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.ReservationFacilitiesUpdate(request.id, request);
        return res;
	}
}
