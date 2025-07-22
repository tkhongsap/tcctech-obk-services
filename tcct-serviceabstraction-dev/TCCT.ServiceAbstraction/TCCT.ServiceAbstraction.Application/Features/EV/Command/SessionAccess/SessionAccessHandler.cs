using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionAccess;
public class SessionAccessHandler : ICommandHandler<SessionAccessCommand, SessionAccessResult>
{
	private readonly IEVService _evService;
	public SessionAccessHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<SessionAccessResult> Handle(SessionAccessCommand request, CancellationToken cancellationToken)
	{
		return _evService.SessionAccess(request);
	}
}