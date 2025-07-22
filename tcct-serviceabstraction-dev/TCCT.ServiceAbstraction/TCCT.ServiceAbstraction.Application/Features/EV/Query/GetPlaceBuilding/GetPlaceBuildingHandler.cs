using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaceBuilding;
public class PlaceBuildingHandler : IQueryHandler<PlaceBuildingQuery, PlaceBuildingResult>
{
	private readonly IEVService _evService;
	public PlaceBuildingHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<PlaceBuildingResult> Handle(PlaceBuildingQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetPlaceBuilding(request);
	}
}
