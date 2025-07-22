using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaces;
public class PlacesHandler : IQueryHandler<PlacesQuery, PlacesResult>
{
	private readonly IEVService _evService;
	public PlacesHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<PlacesResult> Handle(PlacesQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetPlaces(request);
	}
}