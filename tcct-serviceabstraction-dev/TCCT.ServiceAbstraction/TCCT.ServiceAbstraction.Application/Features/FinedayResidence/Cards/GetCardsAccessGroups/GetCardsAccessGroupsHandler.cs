using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetCardsAccessGroups;

public class GetCardsAccessGroupsHandler : IQueryHandler<GetCardsAccessGroupsQuery, List<GetCardsAccessGroupsResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetCardsAccessGroupsHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetCardsAccessGroupsResult>> Handle(GetCardsAccessGroupsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetCardsAccessGroups();
	}
}
