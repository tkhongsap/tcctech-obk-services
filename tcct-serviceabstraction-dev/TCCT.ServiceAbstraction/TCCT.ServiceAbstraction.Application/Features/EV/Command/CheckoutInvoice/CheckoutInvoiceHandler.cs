using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.CheckoutInvoice;
public class CheckoutInvoiceHandler : ICommandHandler<CheckoutInvoiceCommand, CheckoutInvoiceResult>
{
	private readonly IEVService _evService;
	public CheckoutInvoiceHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<CheckoutInvoiceResult> Handle(CheckoutInvoiceCommand request, CancellationToken cancellationToken)
	{
		return _evService.CheckoutInvoice(request);
	}
}