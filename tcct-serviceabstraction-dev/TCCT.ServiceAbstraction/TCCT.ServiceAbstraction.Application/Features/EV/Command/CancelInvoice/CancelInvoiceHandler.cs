using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.CancelInvoice;
public class CancelInvoiceHandler : ICommandHandler<CancelInvoiceCommand, CancelInvoiceResult>
{
	private readonly IEVService _evService;
	public CancelInvoiceHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<CancelInvoiceResult> Handle(CancelInvoiceCommand request, CancellationToken cancellationToken)
	{
		return _evService.CancelInvoice(request);
	}
}