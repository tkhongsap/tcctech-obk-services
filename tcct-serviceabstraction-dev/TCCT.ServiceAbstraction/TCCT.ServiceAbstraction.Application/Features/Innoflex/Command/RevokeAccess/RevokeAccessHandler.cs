using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.RevokeAccess;
public class RevokeAccessHandler : ICommandHandler<RevokeAccessCommand, RevokeAccessResult>
{
	private readonly IInnoflexService _innoflexService;
	public RevokeAccessHandler(IInnoflexService innoflexService)
	{
		_innoflexService = innoflexService;
	}
	public Task<RevokeAccessResult> Handle(RevokeAccessCommand request, CancellationToken cancellationToken)
	{
		return _innoflexService.RevokeAccess(request);
	}
}