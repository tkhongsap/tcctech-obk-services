using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataMemberType;

public class GetDataMemberTypeHandler : IQueryHandler<GetDataMemberTypeQuery, List<GetDataMemberTypeResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetDataMemberTypeHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetDataMemberTypeResult>> Handle(GetDataMemberTypeQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetDataMemberType(request);
    }
}
