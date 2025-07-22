using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetBillingHistory;
public class GetBillingHistoryHandler : ICommandHandler<GetBillingHistoryCommand, GetBillingHistoryResult>
{
	private readonly IServiceMindResidential _service;
	public GetBillingHistoryHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetBillingHistoryResult> Handle(GetBillingHistoryCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetBillingHistory(request);
	}
}