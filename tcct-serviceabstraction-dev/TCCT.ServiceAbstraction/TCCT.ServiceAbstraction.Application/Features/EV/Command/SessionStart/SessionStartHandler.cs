using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStart;
public class SessionStartHandler : ICommandHandler<SessionStartCommand, SessionStartResult>
{
	private readonly IEVService _evService;
	public SessionStartHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<SessionStartResult> Handle(SessionStartCommand request, CancellationToken cancellationToken)
	{
		return _evService.SessionStart(request);
	}
}