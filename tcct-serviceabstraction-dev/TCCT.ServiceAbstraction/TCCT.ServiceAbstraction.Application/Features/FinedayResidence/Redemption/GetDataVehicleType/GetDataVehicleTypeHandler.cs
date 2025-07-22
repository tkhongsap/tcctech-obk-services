using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataVehicleType;

public class GetDataVehicleTypeHandler : IQueryHandler<GetDataVehicleTypeQuery, List<GetDataVehicleTypeResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetDataVehicleTypeHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetDataVehicleTypeResult>> Handle(GetDataVehicleTypeQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetDataVehicleType(request);
    }
}
