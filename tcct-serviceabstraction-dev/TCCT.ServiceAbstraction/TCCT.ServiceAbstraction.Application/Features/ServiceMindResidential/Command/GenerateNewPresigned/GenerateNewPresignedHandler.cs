using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GenerateNewPresigned;
public class GenerateNewPresignedHandler : ICommandHandler<GenerateNewPresignedCommand, GenerateNewPresignedResult>
{
	private readonly IServiceMindResidential _service;
	public GenerateNewPresignedHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GenerateNewPresignedResult> Handle(GenerateNewPresignedCommand request, CancellationToken cancellationToken)
	{
		return await _service.GenerateNewPresigned(request);
	}
}