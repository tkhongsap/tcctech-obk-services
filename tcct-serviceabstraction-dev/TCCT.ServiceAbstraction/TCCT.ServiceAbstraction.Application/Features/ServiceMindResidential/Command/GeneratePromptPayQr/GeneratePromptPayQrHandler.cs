using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GeneratePromptPayQr;
public class GeneratePromptPayQrHandler : ICommandHandler<GeneratePromptPayQrCommand, GeneratePromptPayQrResult>
{
	private readonly IServiceMindResidential _service;
	public GeneratePromptPayQrHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GeneratePromptPayQrResult> Handle(GeneratePromptPayQrCommand request, CancellationToken cancellationToken)
	{
		return await _service.GeneratePromptPayQr(request);
	}
}