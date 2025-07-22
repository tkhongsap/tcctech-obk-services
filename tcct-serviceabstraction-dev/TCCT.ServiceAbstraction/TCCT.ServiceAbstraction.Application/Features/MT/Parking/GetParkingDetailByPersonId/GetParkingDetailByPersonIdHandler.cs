using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingDetailByPersonId;

public class GetParkingDetailByPersonIdHandler : ICommandHandler<GetParkingDetailByPersonIdCommand, GetParkingDetailByPersonIdResult>
{
    private readonly IMTService _service;
    public GetParkingDetailByPersonIdHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<GetParkingDetailByPersonIdResult> Handle(GetParkingDetailByPersonIdCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetParkingDetailByPersonId(request.personID, request.lostCard);
	}
}
