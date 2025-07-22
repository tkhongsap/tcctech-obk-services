using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlace;
public class PlaceHandler : IQueryHandler<PlaceQuery, PlaceResult>
{
	private readonly IEVService _evService;
	public PlaceHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<PlaceResult> Handle(PlaceQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetPlace(request);
	}
}
