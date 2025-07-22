using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData.HomeData;
public class HomeDataHandler : IQueryHandler<HomeDataQuery, HomeDataResult>
{
	private readonly INetatmoService _netatmoservice;
	public HomeDataHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<HomeDataResult> Handle(HomeDataQuery request, CancellationToken cancellationToken)
	{
		return await _netatmoservice.GetHomeData(request.HomeId, request.TenantId);
	}
}
