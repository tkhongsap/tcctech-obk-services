using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParking;

public class GetValetParkingHandler : IQueryHandler<GetValetParkingQuery, GetValetParkingResult>
{
    private readonly IMTService _service;
    public GetValetParkingHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<GetValetParkingResult> Handle(GetValetParkingQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetValetParking(request);
	}
}
