using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateParcelReadStatus;
public class UpdateParcelReadStatusHandler : ICommandHandler<UpdateParcelReadStatusCommand, UpdateParcelReadStatusResult>
{
	private readonly IServiceMindResidential _service;
	public UpdateParcelReadStatusHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<UpdateParcelReadStatusResult> Handle(UpdateParcelReadStatusCommand request, CancellationToken cancellationToken)
	{
		return await _service.UpdateParcelReadStatus(request);
	}
}