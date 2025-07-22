using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateVisitorStatus;
public class UpdateVisitorStatusHandler : ICommandHandler<UpdateVisitorStatusCommand, UpdateVisitorStatusResult>
{
	private readonly IServiceMindResidential _service;
	public UpdateVisitorStatusHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<UpdateVisitorStatusResult> Handle(UpdateVisitorStatusCommand request, CancellationToken cancellationToken)
	{
		return await _service.UpdateVisitorStatus(request);
	}
}