using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.LocationMapping.GetResidenceLocationMapping;

public class GetResidenceLocationMappingHandler : IQueryHandler<GetResidenceLocationMappingQuery, List<GetResidenceLocationMappingResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetResidenceLocationMappingHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetResidenceLocationMappingResult>> Handle(GetResidenceLocationMappingQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetResidenceLocationMapping(request.zoneID, request.floorID);
    }
}
