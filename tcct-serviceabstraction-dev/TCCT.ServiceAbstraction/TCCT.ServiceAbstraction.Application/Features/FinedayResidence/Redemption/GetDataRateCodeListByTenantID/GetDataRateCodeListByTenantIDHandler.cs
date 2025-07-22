using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataRateCodeListByTenantID;

public class GetDataRateCodeListByTenantIDHandler : IQueryHandler<GetDataRateCodeListByTenantIDQuery, List<GetDataRateCodeListByTenantIDResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetDataRateCodeListByTenantIDHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetDataRateCodeListByTenantIDResult>> Handle(GetDataRateCodeListByTenantIDQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetDataRateCodeListByTenantID(request.tenantID, request.memberType, request.vehicleType, request.departmentID);
    }
}
