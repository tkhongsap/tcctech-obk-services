using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.OnboardResidence;
public class OnboardResidenceHandler : ICommandHandler<OnboardResidenceCommand, OnboardResidenceResult>
{
	private readonly IInnoflexService _innoflexService;
	public OnboardResidenceHandler(IInnoflexService innoflexService)
	{
		_innoflexService = innoflexService;
	}
	public Task<OnboardResidenceResult> Handle(OnboardResidenceCommand request, CancellationToken cancellationToken)
	{
		return _innoflexService.OnboardResidence(request);
	}
}