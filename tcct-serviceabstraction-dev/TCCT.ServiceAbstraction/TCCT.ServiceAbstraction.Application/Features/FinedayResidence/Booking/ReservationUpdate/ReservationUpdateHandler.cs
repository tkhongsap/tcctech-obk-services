using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationUpdate;

public class ReservationUpdateHandler : ICommandHandler<ReservationUpdateCommand, ReservationUpdateResult>
{
    private readonly IFinedayResidenceService _service;
    public ReservationUpdateHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<ReservationUpdateResult> Handle(ReservationUpdateCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.ReservationUpdate(request.id, request);
        return res;
	}
}
