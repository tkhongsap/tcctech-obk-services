using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataDepartment;

public class GetDataDepartmentHandler : IQueryHandler<GetDataDepartmentQuery, List<GetDataDepartmentResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetDataDepartmentHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetDataDepartmentResult>> Handle(GetDataDepartmentQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetDataDepartment(request);
    }
}
