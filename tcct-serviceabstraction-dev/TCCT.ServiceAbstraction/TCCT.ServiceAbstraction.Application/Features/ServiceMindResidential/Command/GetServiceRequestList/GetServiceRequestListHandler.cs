using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetServiceRequestList;
public class GetServiceRequestListHandler : ICommandHandler<GetServiceRequestListCommand, GetServiceRequestListResult>
{
	private readonly IServiceMindResidential _service;
	public GetServiceRequestListHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetServiceRequestListResult> Handle(GetServiceRequestListCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetServiceRequestList(request);
	}
}