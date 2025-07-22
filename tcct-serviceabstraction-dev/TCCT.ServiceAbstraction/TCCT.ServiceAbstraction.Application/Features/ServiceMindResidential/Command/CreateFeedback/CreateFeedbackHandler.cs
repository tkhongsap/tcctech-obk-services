using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateFeedback;
public class CreateFeedbackHandler : ICommandHandler<CreateFeedbackCommand, CreateFeedbackResult>
{
	private readonly IServiceMindResidential _service;
	public CreateFeedbackHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<CreateFeedbackResult> Handle(CreateFeedbackCommand request, CancellationToken cancellationToken)
	{
		return await _service.CreateFeedback(request);
	}
}