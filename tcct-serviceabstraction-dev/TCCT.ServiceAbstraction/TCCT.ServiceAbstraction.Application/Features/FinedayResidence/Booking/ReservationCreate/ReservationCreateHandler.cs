using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationCreate;

public class ReservationCreateHandler : ICommandHandler<ReservationCreateCommand, ReservationCreateResult>
{
    private readonly IFinedayResidenceService _service;
    public ReservationCreateHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<ReservationCreateResult> Handle(ReservationCreateCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.ReservationCreate(request.id, request);
        return res;
	}
}
