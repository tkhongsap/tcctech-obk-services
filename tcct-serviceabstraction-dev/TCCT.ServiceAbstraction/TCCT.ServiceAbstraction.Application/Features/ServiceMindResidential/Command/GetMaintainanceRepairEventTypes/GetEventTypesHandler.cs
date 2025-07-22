using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetEventTypes;
public class GetEventTypesHandler : ICommandHandler<GetEventTypesCommand, GetEventTypesResult>
{
	private readonly IServiceMindResidential _service;
	public GetEventTypesHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetEventTypesResult> Handle(GetEventTypesCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetEventTypes(request);
	}
}