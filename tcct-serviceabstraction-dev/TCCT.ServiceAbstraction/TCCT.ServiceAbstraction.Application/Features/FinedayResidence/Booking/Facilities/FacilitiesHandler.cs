using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
using TCCT.ServiceAbstraction.Domain;
using System.Text.Json;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Facilities;

public class FacilitiesHandler : IQueryHandler<FacilitiesQuery, FacilitiesResult>
{
    private readonly IFinedayResidenceService _service;

    public FacilitiesHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<FacilitiesResult> Handle(FacilitiesQuery request, CancellationToken cancellationToken)
	{
        return await _service.Facilities(request);
	}
}
