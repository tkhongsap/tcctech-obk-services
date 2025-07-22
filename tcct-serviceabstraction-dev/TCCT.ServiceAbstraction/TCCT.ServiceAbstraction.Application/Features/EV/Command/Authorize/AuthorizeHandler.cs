using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Authorize;
public class AuthorizeHandler : ICommandHandler<AuthorizeCommand, AuthorizeResult>
{
	private readonly IEVService _evService;
	public AuthorizeHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<AuthorizeResult> Handle(AuthorizeCommand request, CancellationToken cancellationToken)
	{
		return _evService.Authorize(request);
	}
}