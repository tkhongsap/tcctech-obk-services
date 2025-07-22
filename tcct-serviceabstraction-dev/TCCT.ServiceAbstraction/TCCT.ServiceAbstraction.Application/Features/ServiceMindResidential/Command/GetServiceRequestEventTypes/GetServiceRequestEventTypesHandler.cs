using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetServiceRequestEventTypes;
public class GetServiceRequestEventTypesHandler : ICommandHandler<GetServiceRequestEventTypesCommand, GetServiceRequestEventTypesResult>
{
	private readonly IServiceMindResidential _service;
	public GetServiceRequestEventTypesHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetServiceRequestEventTypesResult> Handle(GetServiceRequestEventTypesCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetServiceRequestEventTypes(request);
	}
}