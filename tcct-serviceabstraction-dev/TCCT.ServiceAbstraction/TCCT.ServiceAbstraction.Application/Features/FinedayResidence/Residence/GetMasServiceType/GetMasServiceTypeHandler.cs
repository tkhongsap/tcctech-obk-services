using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetMasServiceType;

public class GetMasServiceTypeHandler : IQueryHandler<GetMasServiceTypeQuery, List<GetMasServiceTypeResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetMasServiceTypeHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetMasServiceTypeResult>> Handle(GetMasServiceTypeQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetMasServiceType(request);
    }
}
