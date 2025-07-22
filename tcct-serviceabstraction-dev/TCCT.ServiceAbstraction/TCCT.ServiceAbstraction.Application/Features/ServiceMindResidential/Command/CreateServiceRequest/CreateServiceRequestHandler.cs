using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateServiceRequest;
public class CreateServiceRequestHandler : ICommandHandler<CreateServiceRequestCommand, CreateServiceRequestResult>
{
	private readonly IServiceMindResidential _service;
	public CreateServiceRequestHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<CreateServiceRequestResult> Handle(CreateServiceRequestCommand request, CancellationToken cancellationToken)
	{
		return await _service.CreateServiceRequest(request);
	}
}