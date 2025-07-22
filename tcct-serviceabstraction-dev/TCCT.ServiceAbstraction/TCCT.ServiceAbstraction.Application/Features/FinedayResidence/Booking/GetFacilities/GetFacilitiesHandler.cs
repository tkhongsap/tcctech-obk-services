using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetFacilities;

public class GetFacilitiesHandler : IQueryHandler<GetFacilitiesQuery, GetFacilitiesResult>
{
    private readonly IFinedayResidenceService _service;
    public GetFacilitiesHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<GetFacilitiesResult> Handle(GetFacilitiesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetFacilities(request);
	}
}
