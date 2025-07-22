using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetInvoiceHistory;
public class GetInvoiceHistoryHandler : ICommandHandler<GetInvoiceHistoryCommand, GetInvoiceHistoryResult>
{
	private readonly IServiceMindResidential _service;
	public GetInvoiceHistoryHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetInvoiceHistoryResult> Handle(GetInvoiceHistoryCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetInvoiceHistory(request);
	}
}