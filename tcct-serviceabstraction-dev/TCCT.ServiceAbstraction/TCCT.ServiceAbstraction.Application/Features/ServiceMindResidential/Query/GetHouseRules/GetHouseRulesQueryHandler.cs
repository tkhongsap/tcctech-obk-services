using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetHouseRules;

public sealed class GetHouseRulesQueryHandler : IQueryHandler<GetHouseRulesQuery, GetHouseRulesResult>
{
	private readonly IServiceMindResidential _service;
	public GetHouseRulesQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetHouseRulesResult> Handle(GetHouseRulesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetHouseRules(request);
	}
}

