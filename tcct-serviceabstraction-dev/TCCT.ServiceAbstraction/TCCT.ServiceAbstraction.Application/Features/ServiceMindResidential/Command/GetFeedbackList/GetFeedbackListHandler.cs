using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetFeedbackList;
public class GetFeedbackListHandler : ICommandHandler<GetFeedbackListCommand, GetFeedbackListResult>
{
	private readonly IServiceMindResidential _service;
	public GetFeedbackListHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetFeedbackListResult> Handle(GetFeedbackListCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetFeedbackList(request);
	}
}