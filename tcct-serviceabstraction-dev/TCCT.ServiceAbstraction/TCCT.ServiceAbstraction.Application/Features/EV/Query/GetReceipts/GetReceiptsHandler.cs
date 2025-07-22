using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipts;
public class SessionHandler : IQueryHandler<GetReceiptsQuery, GetReceiptsResult>
{
	private readonly IEVService _evService;
	public SessionHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetReceiptsResult> Handle(GetReceiptsQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetReceipts(request);
	}
}
