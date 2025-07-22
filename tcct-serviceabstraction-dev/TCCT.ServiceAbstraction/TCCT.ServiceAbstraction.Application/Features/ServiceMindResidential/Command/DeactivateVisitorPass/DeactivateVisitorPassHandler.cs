using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.DeactivateVisitorPass;
public class DeactivateVisitorPassHandler : ICommandHandler<DeactivateVisitorPassCommand, DeactivateVisitorPassResult>
{
	private readonly IServiceMindResidential _service;
	public DeactivateVisitorPassHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<DeactivateVisitorPassResult> Handle(DeactivateVisitorPassCommand request, CancellationToken cancellationToken)
	{
		return await _service.DeactivateVisitorPass(request);
	}
}