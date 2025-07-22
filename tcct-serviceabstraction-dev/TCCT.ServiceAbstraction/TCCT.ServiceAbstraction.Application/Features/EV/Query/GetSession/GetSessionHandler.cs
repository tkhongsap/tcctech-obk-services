using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSession;
public class SessionHandler : IQueryHandler<GetSessionQuery, GetSessionResult>
{
	private readonly IEVService _evService;
	public SessionHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetSessionResult> Handle(GetSessionQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetSession(request);
	}
}
