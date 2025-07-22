using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingSpace;

public class GetParkingSpaceHandler : ICommandHandler<GetParkingSpaceCommand, List<GetParkingSpaceResult>>
{
    private readonly IMTService _service;
    public GetParkingSpaceHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<List<GetParkingSpaceResult>> Handle(GetParkingSpaceCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetParkingSpace(request);
	}
}
