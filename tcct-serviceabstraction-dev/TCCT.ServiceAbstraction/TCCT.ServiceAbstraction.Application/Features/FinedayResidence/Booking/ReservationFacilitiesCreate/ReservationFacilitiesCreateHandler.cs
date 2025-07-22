using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesCreate;

public class ReservationFacilitiesCreateHandler : ICommandHandler<ReservationFacilitiesCreateCommand, ReservationFacilitiesCreateResult>
{
    private readonly IFinedayResidenceService _service;
    public ReservationFacilitiesCreateHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<ReservationFacilitiesCreateResult> Handle(ReservationFacilitiesCreateCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.ReservationFacilitiesCreate(request.id, request);
        return res;
	}
}
