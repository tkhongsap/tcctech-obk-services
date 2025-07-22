using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserves;
public class GetReservesHandler : IQueryHandler<GetReservesQuery, GetReservesResult>
{
	private readonly IEVService _evService;
	public GetReservesHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetReservesResult> Handle(GetReservesQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetReserves(request);
	}
}
