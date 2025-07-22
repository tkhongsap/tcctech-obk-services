using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;


namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
public class ScenariosHandler : IQueryHandler<ScenariosQuery, ScenariosResult>
{
	private readonly INetatmoService _netatmoservice;
	public ScenariosHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<ScenariosResult> Handle(ScenariosQuery request, CancellationToken cancellationToken)
	{
		return await _netatmoservice.GetScenarios(request.HomeId, request.TenantId);
	}
}
