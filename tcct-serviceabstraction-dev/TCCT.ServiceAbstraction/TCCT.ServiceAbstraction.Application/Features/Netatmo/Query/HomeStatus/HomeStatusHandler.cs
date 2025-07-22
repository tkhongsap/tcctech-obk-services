using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
public class HomeStatusHandler : IQueryHandler<HomeStatusQuery, HomeStatusResult>
{
	private readonly INetatmoService _netatmoservice;
	public HomeStatusHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<HomeStatusResult> Handle(HomeStatusQuery request, CancellationToken cancellationToken)
	{
		return await _netatmoservice.GetHomeStatus(request.HomeId, request.TenantId);
	}
}
