using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionInit;
public class SessionInitHandler : ICommandHandler<SessionInitCommand, SessionInitResult>
{
	private readonly IEVService _evService;
	public SessionInitHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<SessionInitResult> Handle(SessionInitCommand request, CancellationToken cancellationToken)
	{
		return _evService.SessionInit(request);
	}
}