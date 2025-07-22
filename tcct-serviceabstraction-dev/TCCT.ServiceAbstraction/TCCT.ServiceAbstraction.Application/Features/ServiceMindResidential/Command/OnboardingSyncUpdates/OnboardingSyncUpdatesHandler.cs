using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.OnboardingSyncUpdates;
public class OnboardingSyncUpdatesHandler : ICommandHandler<OnboardingSyncUpdatesCommand, OnboardingSyncUpdatesResult>
{
	private readonly IServiceMindResidential _service;
	public OnboardingSyncUpdatesHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<OnboardingSyncUpdatesResult> Handle(OnboardingSyncUpdatesCommand request, CancellationToken cancellationToken)
	{
		return await _service.OnboardingSyncUpdates(request);
	}
}