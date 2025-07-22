using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserve;
public class GetReserveHandler : IQueryHandler<GetReserveQuery, GetReserveResult>
{
	private readonly IEVService _evService;
	public GetReserveHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetReserveResult> Handle(GetReserveQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetReserve(request);
	}
}
