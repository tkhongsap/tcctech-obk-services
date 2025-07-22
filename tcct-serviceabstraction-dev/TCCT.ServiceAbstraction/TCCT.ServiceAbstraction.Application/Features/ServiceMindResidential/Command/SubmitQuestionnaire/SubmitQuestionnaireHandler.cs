using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.SubmitQuestionnaire;
public class SubmitQuestionnaireHandler : ICommandHandler<SubmitQuestionnaireCommand, SubmitQuestionnaireResult>
{
	private readonly IServiceMindResidential _service;
	public SubmitQuestionnaireHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<SubmitQuestionnaireResult> Handle(SubmitQuestionnaireCommand request, CancellationToken cancellationToken)
	{
		return await _service.SubmitQuestionnaire(request);
	}
}