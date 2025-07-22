using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRulesCategories;

public sealed class GetHouseRulesCategoriesQueryHandler : IQueryHandler<GetHouseRulesCategoriesQuery, GetHouseRulesCategoriesResult>
{
	private readonly IServiceMindResidential _service;
	public GetHouseRulesCategoriesQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetHouseRulesCategoriesResult> Handle(GetHouseRulesCategoriesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetHouseRulesCategories(request);
	}
}

