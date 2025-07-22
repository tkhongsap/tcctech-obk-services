using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStop;
public class SessionStopHandler : ICommandHandler<SessionStopCommand, SessionStopResult>
{
	private readonly IEVService _evService;
	public SessionStopHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<SessionStopResult> Handle(SessionStopCommand request, CancellationToken cancellationToken)
	{
		return _evService.SessionStop(request);
	}
}