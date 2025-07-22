using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CaseUpdates;
public class CaseUpdatesHandler : ICommandHandler<CaseUpdatesCommand, CaseUpdatesResult>
{
	private readonly IServiceMindResidential _service;
	public CaseUpdatesHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<CaseUpdatesResult> Handle(CaseUpdatesCommand request, CancellationToken cancellationToken)
	{
		return await _service.CaseUpdates(request);
	}
}