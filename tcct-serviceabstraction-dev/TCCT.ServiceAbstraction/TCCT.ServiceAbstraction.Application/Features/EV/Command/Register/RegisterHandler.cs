using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Register;
public class RegisterHandler : ICommandHandler<RegisterCommand, RegisterResult>
{
	private readonly IEVService _evService;
	public RegisterHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<RegisterResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
	{
		return _evService.Register(request);
	}
}