using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSessions;
public class SessionHandler : IQueryHandler<GetSessionsQuery, GetSessionsResult>
{
	private readonly IEVService _evService;
	public SessionHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetSessionsResult> Handle(GetSessionsQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetSessions(request);
	}
}
