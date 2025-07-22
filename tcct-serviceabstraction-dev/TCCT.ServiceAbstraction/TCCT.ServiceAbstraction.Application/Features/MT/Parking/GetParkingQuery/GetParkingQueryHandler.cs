using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingQuery;

public class GetParkingQueryHandler : ICommandHandler<GetParkingQueryCommand, GetParkingQueryResult>
{
    private readonly IMTService _service;
    public GetParkingQueryHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<GetParkingQueryResult> Handle(GetParkingQueryCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetParkingQuery(request);
	}
}
