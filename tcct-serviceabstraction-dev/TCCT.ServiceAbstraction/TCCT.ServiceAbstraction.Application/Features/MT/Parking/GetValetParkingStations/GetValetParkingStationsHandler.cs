using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParkingStations;

public class GetValetParkingStationsHandler : IQueryHandler<GetValetParkingStationsQuery, List<GetValetParkingStationsResult>>
{
    private readonly IMTService _service;
    public GetValetParkingStationsHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<List<GetValetParkingStationsResult>> Handle(GetValetParkingStationsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetValetParkingStations(request);
	}
}
