using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SignOut;
public class SignOutHandler : ICommandHandler<SignOutCommand, SignOutResult>
{
	private readonly IEVService _evService;
	public SignOutHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<SignOutResult> Handle(SignOutCommand request, CancellationToken cancellationToken)
	{
		return _evService.SignOut(request);
	}
}